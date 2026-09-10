import type { Metadata } from "next";
import { RecordPage } from "@/components/record-page"; import { getPublicRows } from "@/lib/content";
export const metadata: Metadata = { title: "Achievements" }; export const dynamic = "force-dynamic";
export default async function Page() { const rows = await getPublicRows("achievements"); return <RecordPage kicker="Achievements" title="Selected milestones beyond the job title." intro="Awards, community leadership, speaking, and technical milestones worth verifying." rows={rows} empty="Selected achievements will appear here." primary={(r)=>String(r.title||"")} secondary={(r)=>[r.kind,r.organization,r.date].filter(Boolean).join(" · ")} description={(r)=>String(r.description||"")}/>; }
