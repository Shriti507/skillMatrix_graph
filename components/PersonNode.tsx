"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type PersonNodeData = {
  name: string;
  role?: string;
};

export function PersonNode({ data }: NodeProps<Node<PersonNodeData, "person">>) {
  return (
    <div className="node-enter min-w-[220px] rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 shadow-sm transition-transform duration-200">
      <Handle type="source" position={Position.Right} className="!bg-blue-700" />
      <p className="text-base font-semibold text-blue-900">{data.name}</p>
      <p className="mt-1 text-xs text-gray-600">{data.role ?? "No role set"}</p>
    </div>
  );
}
