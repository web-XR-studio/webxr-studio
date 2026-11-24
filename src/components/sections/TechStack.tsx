import { Section } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechIcon";
import { MarqueePause } from "@/components/ui/MarqueePause";
import { cn } from "@/lib/utils";

/**
 * TECHNOLOGY — 扱う技術を、左右に流れる2本の帯で見せる。
 *
 * ロゴ（simple-icons）はサーバーで描く。クライアントに読み込むとアイコン集
 * ごと送ることになり非常に重い。
 */
const TECHNOLOGIES = [
  // Web
  "HTML5",
  "CSS3",
  "SCSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "WordPress",
  "Shopify",
  "Webflow",
  "STUDIO",
  "Figma",
  "Adobe XD",
  // System
  "PHP",
  "Laravel",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "Python",
  "Django",
  "Ruby on Rails",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  // App
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Dart",
  "Firebase",
  "Supabase",
  "GraphQL",
  "REST API",
  // AI
  "OpenAI",
  "Claude",
  "Gemini",
  "LangChain",
  "LangGraph",
  "LlamaIndex",
  "MCP",
  "FastAPI",
  "TensorFlow",
  "PyTorch",
  "Hugging Face",
  "Pinecone",
  "Weaviate",
  "ChromaDB",
  "Azure AI",
  "Vertex AI",
];

// 交互に振り分けて、2本の帯に領域が偏らないようにする。
const ROWS = [
  TECHNOLOGIES.filter((_, i) => i % 2 === 0),
  TECHNOLOGIES.filter((_, i) => i % 2 === 1),
];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // 1周にかかる時間は項目数に比例させ、帯どうしの速さを揃える。
  const duration = `${items.length * 3.4}s`;
  const list = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className={cn("flex shrink-0 gap-4 pr-4", copy && "marquee-copy")}
    >
      {items.map((t) => (
        <TechChip key={t} name={t} size="lg" />
      ))}
    </ul>
  );
  return (
    <div
      className="marquee"
      data-reverse={reverse || undefined}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      <div className="marquee-track py-2">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <Section
      id="technology"
      tone="muted"
      eyebrow="TECHNOLOGY"
      title="対応技術"
      description="Web・システム・アプリ・AIで扱う主な技術です。プロジェクトの目的や規模に合わせて、最適な組み合わせを選びます。"
    >
      <div data-reveal className="-mx-5 space-y-4 sm:mx-0">
        <MarqueePause>
          <div className="space-y-4">
            <Row items={ROWS[0]} />
            <Row items={ROWS[1]} reverse />
          </div>
        </MarqueePause>
      </div>
    </Section>
  );
}
