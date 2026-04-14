"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type NodeMouseHandler,
  type OnNodeDrag,
  type EdgeMouseHandler,
  type Edge,
  type Node,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { PersonNode, type PersonNodeData } from "@/components/PersonNode";
import { SkillNode, type SkillNodeData } from "@/components/SkillNode";
import type { Proficiency } from "@/lib/seed";
import { useGraphStore } from "@/store/useGraphStore";

type GraphFlowNode =
  | Node<PersonNodeData, "person">
  | Node<SkillNodeData, "skill">;

const nodeTypes = {
  person: PersonNode,
  skill: SkillNode,
};

type GraphProps = {
  searchQuery?: string;
};

export function Graph({ searchQuery = "" }: GraphProps) {
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const isHydrated = useSyncExternalStore(
    (onStoreChange) => useGraphStore.persist.onFinishHydration(onStoreChange),
    () => useGraphStore.persist.hasHydrated(),
    () => false
  );
  const people = useGraphStore((state) => state.people);
  const skills = useGraphStore((state) => state.skills);
  const connections = useGraphStore((state) => state.connections);
  const nodePositions = useGraphStore((state) => state.nodePositions);
  const removingNodeIds = useGraphStore((state) => state.removingNodeIds);
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const setNodePosition = useGraphStore((state) => state.setNodePosition);

  const connectedSkillIds = useMemo(() => {
    if (!selectedNode || selectedNode.type !== "person") {
      return new Set<string>();
    }

    return new Set(
      connections
        .filter((connection) => connection.personId === selectedNode.id)
        .map((connection) => connection.skillId)
    );
  }, [connections, selectedNode]);

  const connectedPersonIds = useMemo(() => {
    if (!selectedNode || selectedNode.type !== "skill") {
      return new Set<string>();
    }

    return new Set(
      connections
        .filter((connection) => connection.skillId === selectedNode.id)
        .map((connection) => connection.personId)
    );
  }, [connections, selectedNode]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchingNodeIds = useMemo(() => {
    if (!normalizedQuery) {
      return new Set<string>();
    }

    const ids = new Set<string>();
    for (const person of people) {
      const text = `${person.name} ${person.role ?? ""}`.toLowerCase();
      if (text.includes(normalizedQuery)) {
        ids.add(person.id);
      }
    }
    for (const skill of skills) {
      const text = `${skill.name} ${skill.category ?? ""}`.toLowerCase();
      if (text.includes(normalizedQuery)) {
        ids.add(skill.id);
      }
    }
    return ids;
  }, [normalizedQuery, people, skills]);

  const layoutPositions = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir: "LR",
      nodesep: 60,
      ranksep: 170,
      marginx: 40,
      marginy: 40,
    });
    g.setDefaultEdgeLabel(() => ({}));

    for (const person of people) {
      g.setNode(person.id, { width: 240, height: 86 });
    }

    for (const skill of skills) {
      g.setNode(skill.id, { width: 240, height: 76 });
    }

    for (const connection of connections) {
      g.setEdge(connection.personId, connection.skillId);
    }

    dagre.layout(g);

    const positions = new Map<string, { x: number; y: number }>();
    for (const person of people) {
      const node = g.node(person.id);
      if (node) {
        positions.set(person.id, { x: node.x - 120, y: node.y - 43 });
      }
    }
    for (const skill of skills) {
      const node = g.node(skill.id);
      if (node) {
        positions.set(skill.id, { x: node.x - 120, y: node.y - 38 });
      }
    }

    return positions;
  }, [people, skills, connections]);

  const nodes = useMemo<GraphFlowNode[]>(() => {
    const getNodeOpacity = (nodeId: string, nodeType: "person" | "skill") => {
      let opacity = 1;

      if (selectedNode) {
        if (selectedNode.type === "person") {
          if (nodeType === "person") {
            opacity = nodeId === selectedNode.id ? 1 : 0.3;
          } else {
            opacity = connectedSkillIds.has(nodeId) ? 1 : 0.3;
          }
        } else if (nodeType === "skill") {
          opacity = nodeId === selectedNode.id ? 1 : 0.3;
        } else {
          opacity = connectedPersonIds.has(nodeId) ? 1 : 0.3;
        }
      }

      if (normalizedQuery) {
        opacity = matchingNodeIds.has(nodeId) ? opacity : Math.min(opacity, 0.3);
      }

      return opacity;
    };

    const personNodes: GraphFlowNode[] = people.map((person, index) => ({
      id: person.id,
      type: "person",
      data: { name: person.name, role: person.role },
      position: nodePositions[person.id] ?? layoutPositions.get(person.id) ?? { x: 80, y: 80 + index * 145 },
      style: { opacity: getNodeOpacity(person.id, "person") },
      className: [
        removingNodeIds[person.id] ? "node-removing" : "",
        selectedNode?.id === person.id || matchingNodeIds.has(person.id)
          ? "node-selected"
          : "",
      ]
        .join(" ")
        .trim(),
    }));

    const skillNodes: GraphFlowNode[] = skills.map((skill, index) => ({
      id: skill.id,
      type: "skill",
      data: { name: skill.name, category: skill.category },
      position: nodePositions[skill.id] ?? layoutPositions.get(skill.id) ?? { x: 640, y: 80 + index * 130 },
      style: { opacity: getNodeOpacity(skill.id, "skill") },
      className: [
        removingNodeIds[skill.id] ? "node-removing" : "",
        selectedNode?.id === skill.id || matchingNodeIds.has(skill.id)
          ? "node-selected"
          : "",
      ]
        .join(" ")
        .trim(),
    }));

    return [...personNodes, ...skillNodes];
  }, [
    people,
    skills,
    nodePositions,
    removingNodeIds,
    selectedNode,
    connectedSkillIds,
    connectedPersonIds,
    normalizedQuery,
    matchingNodeIds,
    layoutPositions,
  ]);

  const edges = useMemo<Edge[]>(() => {
    const proficiencyStyle: Record<
      Proficiency,
      { color: string; width: number; dash?: string; glow: string }
    > = {
      learning: {
        color: "#eab308",
        width: 2,
        dash: "6 4",
        glow: "drop-shadow(0 0 4px rgba(234,179,8,0.45))",
      },
      familiar: {
        color: "#3b82f6",
        width: 2.2,
        glow: "drop-shadow(0 0 5px rgba(59,130,246,0.45))",
      },
      expert: {
        color: "#22c55e",
        width: 3,
        glow: "drop-shadow(0 0 7px rgba(34,197,94,0.55))",
      },
    };

    const getEdgeOpacity = (personId: string, skillId: string) => {
      if (!selectedNode) {
        return 1;
      }

      if (selectedNode.type === "person") {
        return personId === selectedNode.id && connectedSkillIds.has(skillId) ? 1 : 0.2;
      }

      return skillId === selectedNode.id && connectedPersonIds.has(personId) ? 1 : 0.2;
    };

    return connections.map((connection) => {
      const stylePreset = proficiencyStyle[connection.proficiency];
      const isHovered = hoveredEdgeId === connection.id;
      const glow = isHovered
        ? stylePreset.glow.replace("0.45", "0.75").replace("0.55", "0.85")
        : stylePreset.glow;
      const edgeOpacity = isHovered
        ? 1
        : getEdgeOpacity(connection.personId, connection.skillId);

      return {
        id: connection.id,
        source: connection.personId,
        target: connection.skillId,
        animated: true,
        label: connection.proficiency,
        labelStyle: { fill: stylePreset.color, fontWeight: 500, fontSize: 12 },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.88 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
        zIndex: 10,
        markerEnd: { type: MarkerType.ArrowClosed, color: stylePreset.color },
        style: {
          stroke: stylePreset.color,
          strokeWidth: stylePreset.width,
          strokeDasharray: stylePreset.dash,
          filter: glow,
          opacity: edgeOpacity,
        },
      };
    });
  }, [connections, selectedNode, connectedSkillIds, connectedPersonIds, hoveredEdgeId]);

  const handleNodeClick: NodeMouseHandler<GraphFlowNode> = (_, node) => {
    if (node.type === "person" || node.type === "skill") {
      setSelectedNode({ id: node.id, type: node.type });
    }
  };

  const handleNodeDragStop: OnNodeDrag<GraphFlowNode> = (_, node) => {
    setNodePosition(node.id, node.position);
  };

  const handleEdgeMouseEnter: EdgeMouseHandler = (_, edge) => {
    setHoveredEdgeId(edge.id);
  };

  const handleEdgeMouseLeave: EdgeMouseHandler = () => {
    setHoveredEdgeId(null);
  };

  if (!isHydrated) {
    return (
      <div className="h-full min-h-0 w-full animate-pulse rounded-2xl border border-slate-700/70 bg-slate-900/70 shadow-inner" />
    );
  }

  if (people.length === 0 && skills.length === 0) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md">
        <p className="text-sm text-slate-300">
          Start by adding a person or skill to build your team matrix.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full rounded-2xl border border-slate-700/70 bg-slate-900/65 p-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md transition-all duration-200">
      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onEdgeMouseEnter={handleEdgeMouseEnter}
        onEdgeMouseLeave={handleEdgeMouseLeave}
      >
        <Controls />
        <Background gap={20} size={1.05} color="#334155" />
      </ReactFlow>
    </div>
  );
}
