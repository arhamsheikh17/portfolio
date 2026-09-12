import { PublicFooter, PublicHeader } from "@/components/public-shell";

type RecordRow = Record<string, unknown>;
export function RecordPage({ kicker, title, intro, rows, empty, primary, secondary, description }: { kicker: string; title: string; intro: string; rows: RecordRow[]; empty: string; primary: (row: RecordRow) => string; secondary: (row: RecordRow) => string; description: (row: RecordRow) => string }) {
  return <main className="portfolio-site"><PublicHeader/><section className="page-hero section-shell"><p className="section-kicker">{kicker}</p><h1>{title}</h1><p>{intro}</p></section><section className="record-list section-shell">{rows.length ? rows.map((row, index) => <article key={String(row.id ?? index)}><span>{String(index + 1).padStart(2, "0")}</span><div><p className="project-type">{secondary(row)}</p><h2>{primary(row)}</h2><p>{description(row)}</p></div></article>) : <div className="public-empty"><span>More details coming soon</span><h2>{empty}</h2><p>This section will be expanded when the next verified details are added.</p></div>}</section><PublicFooter/></main>;
}
