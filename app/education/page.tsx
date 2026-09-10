import type { Metadata } from "next";
import { RecordPage } from "@/components/record-page"; import { getPublicRows } from "@/lib/content";
export const metadata: Metadata = { title: "Education" }; export const dynamic = "force-dynamic";
export default async function Page() { const rows = await getPublicRows("education"); return <RecordPage kicker="Education" title="Foundations for a career in software and data." intro="Formal education and selected academic highlights." rows={rows} empty="Education details will appear here once verified." primary={(r)=>String(r.degree||"")} secondary={(r)=>[r.institution,r.field].filter(Boolean).join(" · ")} description={(r)=>[r.start_year,r.end_year].filter(Boolean).join(" — ")}/>; }
