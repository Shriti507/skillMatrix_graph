"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";

export type PersonNodeData = {
  name: string;
  role?: string;
};

export function PersonNode({ data }: NodeProps<Node<PersonNodeData, "person">>) {
  const avatarLetter = (data.name?.trim().charAt(0) || "P").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="min-w-[240px] rounded-xl border border-blue-400/40 bg-blue-500/15 px-4 py-3 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md transition duration-200 hover:scale-[1.02]"
    >
      <Handle type="source" position={Position.Right} className="!bg-blue-700" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-300/60 bg-blue-300/25 text-sm font-semibold text-blue-100">
          {avatarLetter}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{data.name}</p>
          <p className="text-xs text-slate-300">{data.role ?? "No role set"}</p>
        </div>
      </div>
    </motion.div>
  );
}
