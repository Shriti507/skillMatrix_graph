export interface Person {
  id: string;
  name: string;
  role?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export type Proficiency = "learning" | "familiar" | "expert";

export interface Connection {
  id: string;
  personId: string;
  skillId: string;
  proficiency: Proficiency;
}

export interface GraphData {
  people: Person[];
  skills: Skill[];
  connections: Connection[];
}

export const STORAGE_KEY = "skill-graph-store";

export const people: Person[] = [
  { id: "p1", name: "Alice", role: "Frontend Engineer" },
  { id: "p2", name: "Bob", role: "Full-Stack Engineer" },
  { id: "p3", name: "Carol", role: "Backend Engineer" },
  { id: "p4", name: "Dan", role: "Designer" },
  { id: "p5", name: "Eva", role: "DevOps Engineer" },
];

export const skills: Skill[] = [
  { id: "s1", name: "React", category: "Frontend" },
  { id: "s2", name: "TypeScript", category: "Frontend" },
  { id: "s3", name: "Node.js", category: "Backend" },
  { id: "s4", name: "PostgreSQL", category: "Backend" },
  { id: "s5", name: "Docker", category: "DevOps" },
  { id: "s6", name: "Figma", category: "Design" },
  { id: "s7", name: "CSS", category: "Frontend" },
  { id: "s8", name: "GraphQL", category: "Backend" },
  { id: "s9", name: "CI/CD", category: "DevOps" },
  { id: "s10", name: "Next.js", category: "Frontend" },
];

export const connections: Connection[] = [
  { id: "c1", personId: "p1", skillId: "s1", proficiency: "expert" },
  { id: "c2", personId: "p1", skillId: "s2", proficiency: "expert" },
  { id: "c3", personId: "p1", skillId: "s10", proficiency: "familiar" },
  { id: "c4", personId: "p1", skillId: "s7", proficiency: "familiar" },
  { id: "c5", personId: "p1", skillId: "s6", proficiency: "learning" },
  { id: "c6", personId: "p2", skillId: "s1", proficiency: "familiar" },
  { id: "c7", personId: "p2", skillId: "s3", proficiency: "expert" },
  { id: "c8", personId: "p2", skillId: "s2", proficiency: "familiar" },
  { id: "c9", personId: "p2", skillId: "s4", proficiency: "learning" },
  { id: "c10", personId: "p2", skillId: "s10", proficiency: "expert" },
  { id: "c11", personId: "p3", skillId: "s3", proficiency: "expert" },
  { id: "c12", personId: "p3", skillId: "s4", proficiency: "expert" },
  { id: "c13", personId: "p3", skillId: "s8", proficiency: "expert" },
  { id: "c14", personId: "p3", skillId: "s5", proficiency: "familiar" },
  { id: "c15", personId: "p3", skillId: "s2", proficiency: "learning" },
  { id: "c16", personId: "p4", skillId: "s6", proficiency: "expert" },
  { id: "c17", personId: "p4", skillId: "s7", proficiency: "familiar" },
  { id: "c18", personId: "p4", skillId: "s1", proficiency: "learning" },
  { id: "c19", personId: "p5", skillId: "s5", proficiency: "expert" },
  { id: "c20", personId: "p5", skillId: "s9", proficiency: "expert" },
  { id: "c21", personId: "p5", skillId: "s3", proficiency: "familiar" },
  { id: "c22", personId: "p5", skillId: "s4", proficiency: "familiar" },
];

