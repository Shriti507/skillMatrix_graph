"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { XYPosition } from "@xyflow/react";
import {
  STORAGE_KEY,
  connections as seedConnections,
  people as seedPeople,
  skills as seedSkills,
  type Connection,
  type GraphData,
  type Person,
  type Skill,
} from "@/lib/seed";

export type SelectedNode = {
  id: string;
  type: "person" | "skill";
} | null;

interface GraphState extends GraphData {
  nodePositions: Record<string, XYPosition>;
  removingNodeIds: Record<string, true>;
  selectedNode: SelectedNode;
  addPerson: (person: Person) => void;
  addSkill: (skill: Skill) => void;
  addConnection: (connection: Connection) => void;
  updatePerson: (personId: string, updates: Partial<Pick<Person, "name" | "role">>) => void;
  updateSkill: (
    skillId: string,
    updates: Partial<Pick<Skill, "name" | "category">>
  ) => void;
  deleteNode: (nodeId: string, nodeType: "person" | "skill") => void;
  deleteConnection: (connectionId: string) => void;
  setSelectedNode: (node: SelectedNode) => void;
  setNodePosition: (nodeId: string, position: XYPosition) => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const omitKey = <T extends Record<string, unknown>>(obj: T, key: string) => {
  const next = { ...obj };
  delete next[key];
  return next;
};

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      people: seedPeople,
      skills: seedSkills,
      connections: seedConnections,
      nodePositions: {},
      removingNodeIds: {},
      selectedNode: null,

      addPerson: (person) =>
        set((state) => ({
          people: [...state.people, person],
        })),

      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),

      addConnection: (connection) =>
        set((state) => ({
          connections: [...state.connections, connection],
        })),

      updatePerson: (personId, updates) =>
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId ? { ...person, ...updates } : person
          ),
        })),

      updateSkill: (skillId, updates) =>
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId ? { ...skill, ...updates } : skill
          ),
        })),

      deleteNode: (nodeId, nodeType) =>
        (() => {
          const { removingNodeIds } = get();
          if (removingNodeIds[nodeId]) {
            return;
          }

          set((state) => ({
            removingNodeIds: {
              ...state.removingNodeIds,
              [nodeId]: true,
            },
            selectedNode:
              state.selectedNode?.id === nodeId ? null : state.selectedNode,
          }));

          window.setTimeout(() => {
            set((state) => {
              const nextPeople =
                nodeType === "person"
                  ? state.people.filter((person) => person.id !== nodeId)
                  : state.people;

              const nextSkills =
                nodeType === "skill"
                  ? state.skills.filter((skill) => skill.id !== nodeId)
                  : state.skills;

              const nextConnections = state.connections.filter((connection) => {
                if (nodeType === "person") {
                  return connection.personId !== nodeId;
                }
                return connection.skillId !== nodeId;
              });

              const nextNodePositions = omitKey(state.nodePositions, nodeId);
              const nextRemovingNodeIds = omitKey(state.removingNodeIds, nodeId);

              return {
                people: nextPeople,
                skills: nextSkills,
                connections: nextConnections,
                nodePositions: nextNodePositions,
                removingNodeIds: nextRemovingNodeIds,
              };
            });
          }, 150);
        })(),

      deleteConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter(
            (connection) => connection.id !== connectionId
          ),
        })),

      setSelectedNode: (node) =>
        set(() => ({
          selectedNode: node,
        })),

      setNodePosition: (nodeId, position) =>
        set((state) => ({
          nodePositions: {
            ...state.nodePositions,
            [nodeId]: position,
          },
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage
      ),
    }
  )
);
