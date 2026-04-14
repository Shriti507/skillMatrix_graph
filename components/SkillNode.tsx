"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";

export type SkillNodeData = {
  name: string;
  category?: string;
};

export function SkillNode({ data }: NodeProps<Node<SkillNodeData, "skill">>) {
  const categoryClass =
    data.category === "Frontend"
      ? "border-purple-400/40 bg-purple-500/15 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
      : data.category === "Backend"
      ? "border-blue-400/40 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
      : data.category === "DevOps"
      ? "border-amber-400/40 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
      : "border-pink-400/40 bg-pink-500/15 shadow-[0_0_20px_rgba(236,72,153,0.2)]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`min-w-[240px] rounded-xl border px-4 py-3 backdrop-blur-md transition duration-200 hover:scale-[1.02] ${categoryClass}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-purple-700" />
      <p className="text-sm font-semibold text-slate-100">{data.name}</p>
      <p className="mt-1 text-xs text-slate-300">
        {data.category ?? "No category set"}
      </p>
    </motion.div>
  );
}
