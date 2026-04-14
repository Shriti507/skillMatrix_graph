"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type NodeMouseHandler,
  type OnNodeDrag,
  type Edge,
  type Node,
} from "@xyflow/react";
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

export function Graph() {
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

  const nodes = useMemo<GraphFlowNode[]>(() => {
    const personColumnX = 80;
    const skillColumnX = 640;
    const personStartY = 80;
    const skillStartY = 80;
    const personGapY = 145;
    const skillGapY = 130;

    const getNodeOpacity = (nodeId: string, nodeType: "person" | "skill") => {
      if (!selectedNode) {
        return 1;
      }

      if (selectedNode.type === "person") {
        if (nodeType === "person") {
          return nodeId === selectedNode.id ? 1 : 0.25;
        }
        return connectedSkillIds.has(nodeId) ? 1 : 0.2;
      }

      if (nodeType === "skill") {
        return nodeId === selectedNode.id ? 1 : 0.25;
      }
      return connectedPersonIds.has(nodeId) ? 1 : 0.2;
    };

    const personNodes: GraphFlowNode[] = people.map((person, index) => ({
      id: person.id,
      type: "person",
      data: { name: person.name, role: person.role },
      position:
        nodePositions[person.id] ?? { x: personColumnX, y: personStartY + index * personGapY },
      style: { opacity: getNodeOpacity(person.id, "person") },
      className: removingNodeIds[person.id] ? "node-removing" : undefined,
    }));

    const skillNodes: GraphFlowNode[] = skills.map((skill, index) => ({
      id: skill.id,
      type: "skill",
      data: { name: skill.name, category: skill.category },
      position:
        nodePositions[skill.id] ?? { x: skillColumnX, y: skillStartY + index * skillGapY },
      style: { opacity: getNodeOpacity(skill.id, "skill") },
      className: removingNodeIds[skill.id] ? "node-removing" : undefined,
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
  ]);

  const edges = useMemo<Edge[]>(() => {
    const proficiencyColor: Record<Proficiency, string> = {
      learning: "#a16207",
      familiar: "#1d4ed8",
      expert: "#15803d",
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
      const color = proficiencyColor[connection.proficiency];

      return {
        id: connection.id,
        source: connection.personId,
        target: connection.skillId,
        animated: true,
        label: connection.proficiency,
        labelStyle: { fill: color, fontWeight: 500, fontSize: 14 },
        labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95 },
        labelBgPadding: [6, 2],
        labelBgBorderRadius: 4,
        zIndex: 10,
        markerEnd: { type: MarkerType.ArrowClosed, color },
        style: {
          stroke: color,
          strokeWidth: 2.4,
          opacity: getEdgeOpacity(connection.personId, connection.skillId),
        },
      };
    });
  }, [connections, selectedNode, connectedSkillIds, connectedPersonIds]);

  const handleNodeClick: NodeMouseHandler<GraphFlowNode> = (_, node) => {
    if (node.type === "person" || node.type === "skill") {
      setSelectedNode({ id: node.id, type: node.type });
    }
  };

  const handleNodeDragStop: OnNodeDrag<GraphFlowNode> = (_, node) => {
    setNodePosition(node.id, node.position);
  };

  if (!isHydrated) {
    return (
      <div className="h-full min-h-0 w-full animate-pulse rounded-2xl border border-gray-200 bg-white shadow-inner" />
    );
  }

  return (
    <div className="h-full min-h-0 w-full rounded-2xl border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200">
      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
      >
        <MiniMap />
        <Controls />
        <Background gap={20} size={1.1} color="#d4d4d8" />
      </ReactFlow>
    </div>
  );
}
