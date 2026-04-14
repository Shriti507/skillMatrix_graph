"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type SkillNodeData = {
  name: string;
  category?: string;
};

export function SkillNode({ data }: NodeProps<Node<SkillNodeData, "skill">>) {
  return (
    <div className="node-enter min-w-[220px] rounded-xl border border-purple-300 bg-purple-50 px-4 py-3 shadow-sm transition-transform duration-200">
      <Handle type="target" position={Position.Left} className="!bg-purple-700" />
      <p className="text-base font-semibold text-purple-800">{data.name}</p>
      <p className="mt-1 text-xs text-gray-600">
        {data.category ?? "No category set"}
      </p>
    </div>
  );
}
