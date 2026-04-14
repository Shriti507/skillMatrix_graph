"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGraphStore } from "@/store/useGraphStore";

const NODE_DELETE_ANIMATION_MS = 150;

type PersonEditorProps = {
  initialName: string;
  initialRole?: string;
  onSave: (name: string, role?: string) => void;
};

function PersonEditor({ initialName, initialRole, onSave }: PersonEditorProps) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole ?? "");
  const canSave = name.trim().length > 0;

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Name
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Role
        </span>
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <button
        type="button"
        disabled={!canSave}
        onClick={() => onSave(name.trim(), role.trim() || undefined)}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-500"
      >
        Save changes
      </button>
    </div>
  );
}

type SkillEditorProps = {
  initialName: string;
  initialCategory?: string;
  onSave: (name: string, category?: string) => void;
};

function SkillEditor({
  initialName,
  initialCategory,
  onSave,
}: SkillEditorProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory ?? "");
  const canSave = name.trim().length > 0;

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Name
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Category
        </span>
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <button
        type="button"
        disabled={!canSave}
        onClick={() => onSave(name.trim(), category.trim() || undefined)}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-500"
      >
        Save changes
      </button>
    </div>
  );
}

export function SidebarPanel() {
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const people = useGraphStore((state) => state.people);
  const skills = useGraphStore((state) => state.skills);
  const connections = useGraphStore((state) => state.connections);
  const updatePerson = useGraphStore((state) => state.updatePerson);
  const updateSkill = useGraphStore((state) => state.updateSkill);
  const deleteNode = useGraphStore((state) => state.deleteNode);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);

  const selectedPerson =
    selectedNode?.type === "person"
      ? people.find((person) => person.id === selectedNode.id) ?? null
      : null;
  const selectedSkill =
    selectedNode?.type === "skill"
      ? skills.find((skill) => skill.id === selectedNode.id) ?? null
      : null;

  const personSkillRows = useMemo(() => {
    if (!selectedPerson) {
      return [];
    }

    return connections
      .filter((connection) => connection.personId === selectedPerson.id)
      .map((connection) => {
        const skill = skills.find((item) => item.id === connection.skillId);
        return {
          id: connection.id,
          name: skill?.name ?? connection.skillId,
          proficiency: connection.proficiency,
        };
      });
  }, [connections, selectedPerson, skills]);

  const skillPeopleRows = useMemo(() => {
    if (!selectedSkill) {
      return [];
    }

    return connections
      .filter((connection) => connection.skillId === selectedSkill.id)
      .map((connection) => {
        const person = people.find((item) => item.id === connection.personId);
        return {
          id: connection.id,
          name: person?.name ?? connection.personId,
          proficiency: connection.proficiency,
        };
      });
  }, [connections, selectedSkill, people]);

  if (!selectedNode) {
    return null;
  }

  const handleDeleteSelectedNode = () => {
    const shouldDelete = window.confirm(
      "Delete this node? Connected edges will also be removed."
    );
    if (!shouldDelete) {
      return;
    }

    const deletingToast = toast.loading("Deleting node...");
    deleteNode(selectedNode.id, selectedNode.type);
    setSelectedNode(null);
    window.setTimeout(() => {
      toast.success("Node deleted successfully", { id: deletingToast });
    }, NODE_DELETE_ANIMATION_MS + 20);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <aside className="w-full max-w-md rounded-xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-[0_0_28px_rgba(99,102,241,0.2)] backdrop-blur-md transition-all duration-200">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {selectedNode.type === "person" ? "Person" : "Skill"} Details
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">
              {selectedNode.type === "person" ? "Edit Person" : "Edit Skill"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <button
          type="button"
          onClick={handleDeleteSelectedNode}
          className="mb-4 w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-red-700"
        >
          Delete Selected Node
        </button>

        {selectedPerson ? (
          <PersonEditor
            key={selectedPerson.id}
            initialName={selectedPerson.name}
            initialRole={selectedPerson.role}
            onSave={(name, role) =>
              (() => {
                updatePerson(selectedPerson.id, {
                  name: name || selectedPerson.name,
                  role,
                });
                toast.success("Person updated successfully");
              })()
            }
          />
        ) : selectedSkill ? (
          <SkillEditor
            key={selectedSkill.id}
            initialName={selectedSkill.name}
            initialCategory={selectedSkill.category}
            onSave={(name, category) =>
              (() => {
                updateSkill(selectedSkill.id, {
                  name: name || selectedSkill.name,
                  category,
                });
                toast.success("Skill updated successfully");
              })()
            }
          />
        ) : null}

        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {selectedNode.type === "person" ? "Skills" : "People"}
          </h3>
          <ul className="mt-2 space-y-2">
            {(selectedNode.type === "person" ? personSkillRows : skillPeopleRows).length >
            0 ? (
              (selectedNode.type === "person" ? personSkillRows : skillPeopleRows).map(
                (row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 px-3 py-2 text-sm transition hover:bg-slate-800/80"
                  >
                    <span className="font-medium text-slate-100">{row.name}</span>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-200">
                      {row.proficiency}
                    </span>
                  </li>
                )
              )
            ) : (
              <li className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">
                {selectedNode.type === "person"
                  ? "No skills connected yet."
                  : "No people connected yet."}
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}
