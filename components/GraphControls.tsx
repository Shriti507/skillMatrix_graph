"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Proficiency } from "@/lib/seed";
import { useGraphStore } from "@/store/useGraphStore";

const proficiencyOptions: Proficiency[] = ["learning", "familiar", "expert"];

function getNextId(prefix: string, ids: string[]): string {
  const maxNumber = ids.reduce((max, id) => {
    if (!id.startsWith(prefix)) {
      return max;
    }

    const value = Number(id.slice(prefix.length));
    if (Number.isNaN(value)) {
      return max;
    }

    return Math.max(max, value);
  }, 0);

  return `${prefix}${maxNumber + 1}`;
}

export function GraphControls() {
  const people = useGraphStore((state) => state.people);
  const skills = useGraphStore((state) => state.skills);
  const connections = useGraphStore((state) => state.connections);
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const addPerson = useGraphStore((state) => state.addPerson);
  const addSkill = useGraphStore((state) => state.addSkill);
  const addConnection = useGraphStore((state) => state.addConnection);
  const deleteNode = useGraphStore((state) => state.deleteNode);
  const deleteConnection = useGraphStore((state) => state.deleteConnection);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);

  const [personName, setPersonName] = useState("");
  const [personRole, setPersonRole] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [connectionPersonId, setConnectionPersonId] = useState("");
  const [connectionSkillId, setConnectionSkillId] = useState("");
  const [connectionProficiency, setConnectionProficiency] =
    useState<Proficiency>("learning");
  const [selectedConnectionId, setSelectedConnectionId] = useState("");

  const isDuplicateConnection = useMemo(() => {
    if (!connectionPersonId || !connectionSkillId) {
      return false;
    }

    return connections.some(
      (connection) =>
        connection.personId === connectionPersonId &&
        connection.skillId === connectionSkillId
    );
  }, [connections, connectionPersonId, connectionSkillId]);

  const canAddConnection =
    Boolean(connectionPersonId) && Boolean(connectionSkillId) && !isDuplicateConnection;

  const connectionOptions = useMemo(() => {
    return connections.map((connection) => {
      const person = people.find((item) => item.id === connection.personId);
      const skill = skills.find((item) => item.id === connection.skillId);
      return {
        id: connection.id,
        label: `${person?.name ?? connection.personId} -> ${
          skill?.name ?? connection.skillId
        } (${connection.proficiency})`,
      };
    });
  }, [connections, people, skills]);

  const onAddPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = personName.trim();
    if (!name) return;

    addPerson({
      id: getNextId(
        "p",
        people.map((person) => person.id)
      ),
      name,
      role: personRole.trim() || undefined,
    });

    setPersonName("");
    setPersonRole("");
  };

  const onAddSkill = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = skillName.trim();
    if (!name) return;

    addSkill({
      id: getNextId(
        "s",
        skills.map((skill) => skill.id)
      ),
      name,
      category: skillCategory.trim() || undefined,
    });

    setSkillName("");
    setSkillCategory("");
  };

  const onAddConnection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!connectionPersonId || !connectionSkillId) return;
    if (isDuplicateConnection) {
      window.alert("This person-skill connection already exists.");
      return;
    }

    addConnection({
      id: getNextId(
        "c",
        connections.map((connection) => connection.id)
      ),
      personId: connectionPersonId,
      skillId: connectionSkillId,
      proficiency: connectionProficiency,
    });

    setConnectionPersonId("");
    setConnectionSkillId("");
    setConnectionProficiency("learning");
  };

  const onDeleteSelectedNode = () => {
    if (!selectedNode) return;
    deleteNode(selectedNode.id, selectedNode.type);
    setSelectedNode(null);
  };

  const onDeleteConnection = () => {
    if (!selectedConnectionId) return;
    deleteConnection(selectedConnectionId);
    setSelectedConnectionId("");
  };

  return (
    <section className="space-y-6 rounded-xl bg-slate-900/45 p-1">
      <p className="text-sm text-slate-300">
        Add and remove nodes/connections. Changes update the graph instantly.
      </p>

      <form onSubmit={onAddPerson} className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Add Person
        </h3>
        <input
          value={personName}
          onChange={(event) => setPersonName(event.target.value)}
          placeholder="Name"
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
        <input
          value={personRole}
          onChange={(event) => setPersonRole(event.target.value)}
          placeholder="Role"
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
        <button className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md">
          Add Person
        </button>
      </form>

      <form onSubmit={onAddSkill} className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Add Skill
        </h3>
        <input
          value={skillName}
          onChange={(event) => setSkillName(event.target.value)}
          placeholder="Skill name"
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
        <input
          value={skillCategory}
          onChange={(event) => setSkillCategory(event.target.value)}
          placeholder="Category"
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
        <button className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md">
          Add Skill
        </button>
      </form>

      <form onSubmit={onAddConnection} className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Add Connection
        </h3>
        <select
          value={connectionPersonId}
          onChange={(event) => setConnectionPersonId(event.target.value)}
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select person</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <select
          value={connectionSkillId}
          onChange={(event) => setConnectionSkillId(event.target.value)}
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select skill</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
        <select
          value={connectionProficiency}
          onChange={(event) =>
            setConnectionProficiency(event.target.value as Proficiency)
          }
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        >
          {proficiencyOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!canAddConnection}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-500"
        >
          Add Connection
        </button>
        {isDuplicateConnection ? (
          <p className="text-xs text-red-400">
            This connection already exists for the selected person and skill.
          </p>
        ) : null}
      </form>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Delete Node
        </h3>
        <p className="text-xs text-slate-400">
          Select a node in the graph, then delete it (connected edges are removed).
        </p>
        <button
          type="button"
          disabled={!selectedNode}
          onClick={onDeleteSelectedNode}
          className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          Delete Selected Node
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Delete Connection
        </h3>
        <select
          value={selectedConnectionId}
          onChange={(event) => setSelectedConnectionId(event.target.value)}
          className="w-full rounded-lg border border-slate-700/45 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select connection</option>
          {connectionOptions.map((connection) => (
            <option key={connection.id} value={connection.id}>
              {connection.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!selectedConnectionId}
          onClick={onDeleteConnection}
          className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          Delete Connection
        </button>
      </div>
    </section>
  );
}
