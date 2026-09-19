import { env } from "cloudflare:workers";

export type ProjectRecord = {
  id: string; title: string; slug: string; short_description: string; problem_statement: string;
  objectives: string; data_sources: string; architecture_text: string; implementation: string;
  engineering_decisions: string; challenges: string; results: string; learning: string;
  tech_stack: string; github_url: string | null; demo_url: string | null; article_url: string | null;
  status: string; is_featured: number; is_published: number; display_order: number;
};

const project = (value: Partial<ProjectRecord> & Pick<ProjectRecord, "id" | "title" | "slug" | "short_description" | "problem_statement" | "tech_stack" | "github_url">): ProjectRecord => ({
  objectives: "Build a dependable, automated path from source data to analytics-ready information while keeping the design scalable and maintainable.",
  data_sources: "Operational and event data from the project domain, processed through cloud-native ingestion and transformation stages.",
  architecture_text: "The design separates ingestion, storage, transformation, quality checks, and consumption so each stage can evolve without coupling the whole pipeline.",
  implementation: "Built as an end-to-end engineering case study with repeatable processing, validation, and analytics-ready outputs.",
  engineering_decisions: "Cloud services and open data tooling were selected around reliability, clear ownership, and the ability to scale each stage independently.",
  challenges: "The core challenge was turning fragmented or fast-moving data into a consistent analytical model without introducing manual load steps.",
  results: "A portfolio-ready reference architecture that demonstrates practical data engineering across ingestion, transformation, storage, and analysis.",
  learning: "Reliable data products depend as much on orchestration, validation, and data contracts as they do on the individual cloud services.",
  demo_url: null, article_url: null, status: "completed", is_featured: 0, is_published: 1, display_order: 0,
  ...value,
});

export const fallbackProjects: ProjectRecord[] = [
  project({ id: "azure-youtube", slug: "youtube-trending-pipeline-azure", display_order: 1, is_featured: 1, title: "YouTube Trending Data Pipeline on Azure", short_description: "An automated, multi-region pipeline for turning YouTube trending data into governed, analytics-ready datasets on Microsoft Azure.", problem_statement: "Organizations need timely insight into YouTube trends across geographic markets, but manual collection is slow, inconsistent, and difficult to govern at scale.", tech_stack: JSON.stringify(["Microsoft Azure", "Python", "ETL/ELT", "Data Quality", "Analytics"]), github_url: "https://github.com/arhamsheikh17/youtube-datapipeline-azure" }),
  project({ id: "aws-youtube", slug: "youtube-trending-pipeline-aws", display_order: 2, is_featured: 1, title: "YouTube Trending Data Pipeline on AWS", short_description: "A scalable AWS workflow that automates collection, transformation, validation, and analysis of multi-region trending-video data.", problem_statement: "Manual collection and analysis of regional YouTube trends is time-consuming, error-prone, and unable to provide dependable, timely insight.", tech_stack: JSON.stringify(["AWS", "Python", "ETL/ELT", "Data Warehousing", "Analytics"]), github_url: "https://github.com/arhamsheikh17/youtube-trending-data-pipeline" }),
  project({ id: "rebtel", slug: "rebtel-enterprise-intelligence-hub", display_order: 3, title: "Rebtel Telecom & Fintech Intelligence Hub", short_description: "A GCP intelligence architecture unifying telecom, payment, support, and transfer signals for fraud, customer, network, and revenue analysis.", problem_statement: "Telecom and remittance teams struggle with fragmented CDR streams, payments, tickets, and transfers, limiting real-time visibility into risk and service health.", tech_stack: JSON.stringify(["Google Cloud Platform", "BigQuery", "Data Modelling", "Streaming", "Analytics"]), github_url: "https://github.com/arhamsheikh17/telecom-project" }),
  project({ id: "kafka-stock", slug: "kafka-stock-market-pipeline", display_order: 4, title: "Real-Time Stock Market Pipeline with Kafka", short_description: "A Kafka producer-consumer pipeline that streams market events into an S3 data lake and makes them queryable through Glue and Athena.", problem_statement: "Financial teams need low-latency market-event ingestion and unified storage for monitoring, event-driven analytics, and stream-processing experiments.", architecture_text: "CSV market events flow through a Kafka producer and consumer into Amazon S3. AWS Glue catalogs the stored data so analysts can query it with Athena; EC2 hosts the Kafka broker.", tech_stack: JSON.stringify(["Apache Kafka", "AWS S3", "AWS Glue", "Athena", "EC2"]), github_url: "https://github.com/arhamsheikh17/kafka-dataEngineering-stockMarket-project" }),
  project({ id: "msk-snowflake", slug: "amazon-msk-snowflake-streaming", display_order: 5, title: "Amazon MSK to Snowflake Streaming Pipeline", short_description: "A near-real-time path from event producer to Amazon MSK, S3, Snowpipe, and Snowflake for query-ready stock-tick analytics.", problem_statement: "Teams need reliable, low-latency warehouse ingestion without fragmented tooling or manual loading between the stream and analytical tables.", architecture_text: "Events move from a producer to Amazon MSK, through MSK Connect into S3, and then through Snowpipe into Snowflake for validation and analysis.", tech_stack: JSON.stringify(["Amazon MSK", "MSK Connect", "S3", "Snowpipe", "Snowflake"]), github_url: "https://github.com/arhamsheikh17/kafka-dataengineering-msk-stock" }),
  project({ id: "snowflake-scd", slug: "snowflake-scd-data-warehouse", display_order: 6, title: "SCD Type 1 & 2 in Snowflake", short_description: "An automated Snowflake implementation for preserving dimensional history or applying current-state overwrites with near-real-time processing.", problem_statement: "Data warehouses must capture changing dimension records accurately while supporting both current-state reporting and historical analysis.", architecture_text: "The implementation combines Snowflake Streams, Tasks, Snowpipe, and stored procedures to automate CDC-style ingestion and SCD Type 1 and Type 2 handling.", tech_stack: JSON.stringify(["Snowflake", "AWS", "Snowpipe", "Streams", "Tasks"]), github_url: "https://github.com/arhamsheikh17/scd-data-warehousing-with-snowflake" }),
];

export const fallbackProject = fallbackProjects[0];

const skillGroups = {
  "Languages & foundations": ["Python", "SQL", "Java", "JavaScript / TypeScript"],
  "Data engineering": ["ETL / ELT", "Apache Spark", "PySpark", "dbt", "Apache Airflow", "Apache Kafka", "Data Warehousing", "Data Modelling"],
  "Cloud platforms": ["AWS", "Microsoft Azure", "Google Cloud Platform"],
  "Cloud data stack": ["Snowflake", "Microsoft Fabric", "BigQuery", "Databricks", "S3", "Glue", "Lambda", "Athena", "EC2", "CloudWatch", "QuickSight"],
  "Databases & analytics": ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "Pandas", "NumPy", "Power BI", "Matplotlib", "Seaborn", "Streamlit"],
  "Frontend engineering": ["React", "Next.js", "Angular", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Supabase"],
  "Engineering tools": ["Docker", "Terraform", "Git", "GitHub", "VS Code", "Jupyter Notebook"],
};

const fallbackRows = {
  skills: Object.entries(skillGroups).flatMap(([category, names], group) => names.map((name, index) => ({ id: `skill-${group}-${index}`, name, category, is_published: 1, display_order: group * 20 + index }))),
  experiences: [
    { id: "saylani-intern", title: "Data Engineer Intern", organization: "Saylani Mass IT Training", kind: "Internship", location: "On-site · Karachi, Sindh, Pakistan", start_date: "June 2026", end_date: "Present", summary: "Build end-to-end data products and production-ready cloud pipelines, with a focus on dependable ingestion, transformation, and analytics workflows.", technologies: JSON.stringify(["AWS", "Python", "SQL", "Data Pipelines"]), is_current: 1, is_published: 1, display_order: 1 },
    { id: "saylani-trainee", title: "Data Engineer Trainee", organization: "Saylani Mass IT Training", kind: "Apprenticeship", location: "On-site · Karachi, Sindh, Pakistan", start_date: "May 2025", end_date: "May 2026", summary: "Designed and implemented 17+ end-to-end data engineering pipelines using Python, SQL, Kafka, and AWS services including S3, Lambda, Glue, Step Functions, EventBridge, Redshift, and MSK.", technologies: JSON.stringify(["Python", "SQL", "Kafka", "AWS"]), is_published: 1, display_order: 2 },
    { id: "aws-sbg", title: "Co-Lead", organization: "AWS Student Builders Group — UoK", kind: "Community leadership", location: "Karachi", start_date: "One-year tenure", end_date: "Present", summary: "Coordinate technical sessions and community activities that give university students practical exposure to AWS cloud services.", is_current: 1, is_published: 1, display_order: 3 },
    { id: "teacher", title: "O/A-Level Teacher & Tutor", organization: "Self-employed", kind: "Teaching", location: "Karachi", start_date: "2021", end_date: "Present", summary: "Taught 20+ students from schools including Generation's School, The Academy, and The Next School across Mathematics, Additional Mathematics, Computer Science, and English Language.", is_current: 1, is_published: 1, display_order: 4 },
    { id: "sentros", title: "Founder & CEO", organization: "Sentros AI", kind: "Entrepreneurship", location: "Karachi", start_date: "March 2026", end_date: "Present", summary: "Lead an automation agency focused on practical automation services for business platforms.", verification_url: "https://sentrosai-website.vercel.app/", is_current: 1, is_published: 1, display_order: 5 },
  ],
  education: [
    { id: "bsse", degree: "Bachelor of Science in Software Engineering", institution: "University of Karachi", field: "UBIT · Software Engineering", start_year: "2023", end_year: "Graduating December 2026", highlights: JSON.stringify(["Data Structures & Algorithms", "Database Systems", "Software Engineering", "Operating Systems", "Object-Oriented Programming", "Statistics & Probability", "Cloud and data coursework"]), is_published: 1, display_order: 1 },
    { id: "intermediate", degree: "Intermediate in Pre-Engineering", institution: "Government Delhi College", field: "Pre-Engineering", start_year: "2020", end_year: "2022", highlights: "[]", is_published: 1, display_order: 2 },
  ],
  certifications: [
    { id: "fabric-data-engineer", title: "Microsoft Certified: Fabric Data Engineer Associate", issuer: "Microsoft", issue_date: "August 16, 2026", expiry_date: "August 16, 2027", credential_id: "524A545789C6661A", credential_url: "https://learn.microsoft.com/en-us/users/arhamulhaqsheikh-9037/credentials/524a545789c6661a", skills: JSON.stringify(["Microsoft Fabric", "Data Engineering"]), is_published: 1, display_order: 1 },
    { id: "aws-cloud-practitioner", title: "AWS Cloud Practitioner Essentials", issuer: "Amazon Web Services · Coursera", issue_date: "December 20, 2025", credential_id: "CMFLMX8RM6JR", credential_url: "https://www.coursera.org/account/accomplishments/verify/CMFLMX8RM6JR", skills: JSON.stringify(["AWS", "Cloud Foundations"]), is_published: 1, display_order: 2 },
    { id: "snowflake-warehouse", title: "Snowflake Badge 01: Data Warehouse", issuer: "Snowflake", issue_date: "January 10, 2026", credential_id: "171399066", credential_url: null, skills: JSON.stringify(["Snowflake", "Data Warehousing"]), is_published: 1, display_order: 3 },
    { id: "snowflake-marketplace", title: "Snowflake Badge 02: Collaboration & Marketplace", issuer: "Snowflake", issue_date: "January 18, 2026", credential_id: "172056491", credential_url: null, skills: JSON.stringify(["Snowflake", "Data Sharing"]), is_published: 1, display_order: 4 },
    { id: "aws-cloud-club-core-team", title: "AWS Cloud Club Core Team", issuer: "AWS Cloud Club · Credly", issue_date: null, credential_id: null, credential_url: "https://www.credly.com/badges/8afb961f-7657-4791-835d-a7edd94a7747", skills: JSON.stringify(["AWS", "Community Leadership"]), is_published: 1, display_order: 5 },
    { id: "advanced-javascript", title: "Advanced JavaScript 3: Objects, Collections, Functions", issuer: "Scrimba · Coursera", issue_date: "August 12, 2025", credential_id: "YNWKTQWF8CA3", credential_url: "https://www.coursera.org/account/accomplishments/verify/YNWKTQWF8CA3", skills: JSON.stringify(["JavaScript", "Objects & Collections"]), is_published: 1, display_order: 6 },
  ],
  achievements: [
    { id: "community-lead", title: "Co-Lead, AWS Student Builders Group UoK", kind: "Leadership", organization: "AWS SBG UoK", date: "Current", description: "Help lead technical sessions and community activities that make AWS learning more practical for university students.", is_published: 1, display_order: 1 },
    { id: "teaching-impact", title: "20+ O-Level Students Taught", kind: "Teaching impact", organization: "Independent tutoring", date: "2021 — Present", description: "More than four years of teaching students across Mathematics, Additional Mathematics, Computer Science, and English Language.", is_published: 1, display_order: 2 },
  ],
};

function hasDb(): boolean { return Boolean(env.DB); }

export async function getPublishedProjects(): Promise<ProjectRecord[]> {
  if (!hasDb()) return fallbackProjects;
  try {
    const result = await env.DB!.prepare("SELECT id,title,slug,short_description,problem_statement,objectives,data_sources,architecture_text,implementation,engineering_decisions,challenges,results,learning,tech_stack,github_url,demo_url,article_url,status,is_featured,is_published,display_order FROM projects WHERE is_published = 1 ORDER BY is_featured DESC, display_order ASC, updated_at DESC LIMIT 24").all<ProjectRecord>();
    return result.results.length ? result.results : fallbackProjects;
  } catch { return fallbackProjects; }
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  if (!hasDb()) return fallbackProjects.find((item) => item.slug === slug) ?? null;
  try {
    const row = await env.DB!.prepare("SELECT id,title,slug,short_description,problem_statement,objectives,data_sources,architecture_text,implementation,engineering_decisions,challenges,results,learning,tech_stack,github_url,demo_url,article_url,status,is_featured,is_published,display_order FROM projects WHERE slug = ?1 AND is_published = 1 LIMIT 1").bind(slug).first<ProjectRecord>();
    return row ?? fallbackProjects.find((item) => item.slug === slug) ?? null;
  } catch { return fallbackProjects.find((item) => item.slug === slug) ?? null; }
}

export async function getPublicRows(table: keyof typeof fallbackRows): Promise<Record<string, unknown>[]> {
  if (!hasDb()) return fallbackRows[table] as unknown as Record<string, unknown>[];
  try {
    const result = (await env.DB!.prepare(`SELECT * FROM ${table} WHERE is_published = 1 ORDER BY display_order ASC, updated_at DESC LIMIT 80`).all()).results;
    return result.length ? result : fallbackRows[table] as unknown as Record<string, unknown>[];
  } catch { return fallbackRows[table] as unknown as Record<string, unknown>[]; }
}
