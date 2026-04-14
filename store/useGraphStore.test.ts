/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY, connections, people, skills } from "../lib/seed";
import { useGraphStore } from "./useGraphStore";

describe("useGraphStore smoke checks", () => {
  beforeEach(() => {
    localStorage.clear();
    useGraphStore.setState({
      people: [...people],
      skills: [...skills],
      connections: [...connections],
      nodePositions: {},
      removingNodeIds: {},
      selectedNode: null,
    });
    vi.useRealTimers();
  });

  it("creates person, skill, and connection", () => {
    const store = useGraphStore.getState();

    store.addPerson({ id: "p99", name: "Test Person", role: "QA" });
    store.addSkill({ id: "s99", name: "Testing", category: "Quality" });
    store.addConnection({
      id: "c99",
      personId: "p99",
      skillId: "s99",
      proficiency: "familiar",
    });

    const next = useGraphStore.getState();
    expect(next.people.some((person) => person.id === "p99")).toBe(true);
    expect(next.skills.some((skill) => skill.id === "s99")).toBe(true);
    expect(next.connections.some((connection) => connection.id === "c99")).toBe(true);
  });

  it("edits person and skill fields", () => {
    const store = useGraphStore.getState();

    store.updatePerson("p1", { name: "Alice Updated", role: "Lead Engineer" });
    store.updateSkill("s1", { name: "React Advanced", category: "Frontend" });

    const next = useGraphStore.getState();
    expect(next.people.find((person) => person.id === "p1")?.name).toBe("Alice Updated");
    expect(next.skills.find((skill) => skill.id === "s1")?.name).toBe("React Advanced");
  });

  it("deletes node and removes connected edges after animation timeout", () => {
    vi.useFakeTimers();
    const store = useGraphStore.getState();

    store.deleteNode("p1", "person");
    vi.advanceTimersByTime(170);

    const next = useGraphStore.getState();
    expect(next.people.some((person) => person.id === "p1")).toBe(false);
    expect(next.connections.some((connection) => connection.personId === "p1")).toBe(false);
  });

  it("deletes a single connection", () => {
    const store = useGraphStore.getState();
    store.deleteConnection("c1");

    expect(useGraphStore.getState().connections.some((connection) => connection.id === "c1")).toBe(
      false
    );
  });

  it("persists updates to localStorage", () => {
    useGraphStore.getState().addPerson({ id: "p101", name: "Persisted User" });

    const persistedRaw = localStorage.getItem(STORAGE_KEY);
    expect(persistedRaw).toContain("p101");
  });
});
