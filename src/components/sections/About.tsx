import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechIcon";
import { ArrowIcon, SectionLink } from "@/components/ui/SectionLink";
import { CountUp } from "@/components/ui/CountUp";
import {
  DomainArt,
  DomainIcon,
  type DomainKind,
} from "@/components/brand/DomainArt";
import { EXPERIENCE } from "@/lib/company-facts";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/utils";

/**
 * ABOUT US — an intro statement, the four specialist teams, and a closing
 * summary. The team content is editorial copy rather than DB-driven, so it
 * lives here as a typed constant; move it to a table if it ever needs to be
 * admin-editable.
 */

export type Team = {
  no: string;
  en: string;
  ja: string;
  /** One-line statement of purpose. */
  mission: string;
  /** Team introduction paragraph. */
  intro: string;
  /** Industries the team works across. */
  industries: string[];
  /** Concrete services offered. */
  services: string[];
  /** Technologies, rendered as chips with brand logos where available. */
  stack: string[];
  /** Which domain illustration / icon represents the team. */
  kind: DomainKind;
  /**
   * /about 上のカードに振る id。トップページのチームカードや、担当チーム
   * 判定の結果から `/about#<slug>` で直接飛んでくる。
   */
  slug: string;
};

export const TEAMS: Team[] = [
  {
    no: "01",
    en: "Web Production Team",
    kind: "web",
    slug: "team-web",
    ja: "Web制作チーム",
    mission: "企業の想いをカタチにし、成果につながるWebサイトを創造します。",
    intro:
      "私たちのWeb制作チームは、企業のブランド価値を最大限に引き出すWebサイトを企画・制作しています。コーポレートサイトや採用サイト、ランディングページ、ECサイトまで幅広く対応し、デザイン性・ユーザビリティ・SEOを兼ね備えた高品質なWebサイトをご提供します。",
    industries: [
      "コーポレート",
      "EC・小売",
      "医療・クリニック",
      "教育",
      "不動産",
      "飲食",
      "製造業",
      "スタートアップ",
    ],
    services: [
      "コーポレートサイト制作",
      "ブランドサイト制作",
      "ランディングページ制作",
      "ECサイト制作",
      "WordPress構築",
      "Shopify構築",
      "UI/UXデザイン",
      "SEO対策",
      "Webサイト保守・運用",
    ],
    stack: [
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
    ],
  },
  {
    no: "02",
    en: "System Development Team",
    kind: "system",
    slug: "team-system",
    ja: "システム開発チーム",
    mission: "企業の業務をデジタルの力で最適化し、持続的な成長を支えます。",
    intro:
      "業務システムからクラウドサービスまで、お客様の業務課題に合わせた最適なシステムを設計・開発します。拡張性・保守性・セキュリティを重視し、長く安心してご利用いただけるシステムをご提供します。",
    industries: [
      "製造業",
      "医療",
      "建設",
      "物流",
      "教育",
      "金融",
      "小売",
      "SaaS",
    ],
    services: [
      "業務システム開発",
      "販売管理システム",
      "在庫管理システム",
      "会員管理システム",
      "CRM・ERP開発",
      "API開発",
      "クラウドシステム開発",
      "DX支援",
    ],
    stack: [
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
    ],
  },
  {
    no: "03",
    en: "App Development Team",
    kind: "app",
    slug: "team-app",
    ja: "アプリ開発チーム",
    mission: "人とテクノロジーをつなぎ、快適なモバイル体験を実現します。",
    intro:
      "iOS・Androidアプリをはじめ、クロスプラットフォームアプリの開発まで幅広く対応しています。使いやすさとデザイン性を両立したアプリケーションを開発し、新しい価値を創出します。",
    industries: [
      "EC",
      "医療",
      "教育",
      "フィットネス",
      "SNS",
      "FinTech",
      "IoT",
      "エンターテインメント",
    ],
    services: [
      "iPhoneアプリ開発",
      "Androidアプリ開発",
      "Flutter開発",
      "React Native開発",
      "PWA開発",
      "サブスクリプションサービス開発",
      "決済システム開発",
    ],
    stack: [
      "Swift",
      "Kotlin",
      "Flutter",
      "React Native",
      "Dart",
      "Firebase",
      "Supabase",
      "GraphQL",
      "REST API",
    ],
  },
  {
    no: "04",
    en: "AI Development Team",
    kind: "ai",
    slug: "team-ai",
    ja: "AI開発チーム",
    mission: "AI技術で企業の可能性を広げ、新たな価値を創造します。",
    intro:
      "生成AIや機械学習を活用し、業務効率化からAIシステム開発まで幅広く支援しています。お客様の課題に寄り添い、実用性とビジネス成果を重視したAIソリューションをご提供します。",
    industries: [
      "カスタマーサポート",
      "EC",
      "医療",
      "教育",
      "金融",
      "製造業",
      "メディア",
      "SaaS",
    ],
    services: [
      "生成AIシステム開発",
      "AIチャットボット開発",
      "AIエージェント開発",
      "RAG構築",
      "LLM導入支援",
      "OCRシステム開発",
      "音声認識AI",
      "画像認識AI",
      "業務自動化（AI Automation）",
    ],
    stack: [
      "OpenAI",
      "Claude",
      "Gemini",
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "MCP",
      "Python",
      "FastAPI",
      "TensorFlow",
      "PyTorch",
      "Hugging Face",
      "Pinecone",
      "Weaviate",
      "ChromaDB",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Azure AI",
      "Vertex AI",
    ],
  },
];

/**
 * Small caps label used above each block within a team card.
 * `tone="onDark"` switches it for the navy header band, where `text-muted`
 * would fail contrast.
 */
function BlockLabel({
  children,
  tone = "onLight",
}: {
  children: React.ReactNode;
  tone?: "onLight" | "onDark";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]",
        tone === "onDark" ? "text-cyan" : "text-accent-ink",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "onDark" ? "bg-cyan" : "bg-accent",
        )}
      />
      {children}
    </p>
  );
}

/**
 * 導入: 大きな一文と本文、右に写真。トップページと /about で共通。
 * 見出しは左の列の頭に置き、縦に長い写真と左右の釣り合いをとる。
 */
function Intro({ showHeader }: { showHeader: boolean }) {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
      <div>
        {showHeader && (
          <SectionHeading
            eyebrow="ABOUT US"
            title="私たちについて"
            className="mb-12"
          />
        )}
        <p
          data-reveal
          className="text-[1.7rem] font-black leading-[1.55] tracking-[0.01em] text-ink sm:text-4xl sm:leading-[1.5] xl:text-[2.6rem]"
        >
          作って終わりではなく、
          <br />
          <span className="relative whitespace-nowrap">
            <span className="relative z-10 text-accent-ink">育て続ける</span>
            {/* 蛍光ペンのような下線。 */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] bg-accent/15"
            />
          </span>
          ITパートナー。
        </p>
        <div
          data-reveal
          style={revealDelay(1, 140)}
          className="mt-8 space-y-5 text-base leading-[2.05] text-ink-soft sm:text-lg"
        >
          <p>
            私たちは、Web・システム・アプリ・AIを専門とするエンジニア・デザイナーで構成された開発チームです。
          </p>
          <p>
            それぞれの専門領域を持つプロフェッショナルが連携し、企画から設計、開発、運用までワンストップで提供しています。
          </p>
        </div>
      </div>

      {/* 写真は透過の重ね組みなので、白地の上にそのまま置ける。幕が左から
          開くように出し、中の写真はわずかに引きながら落ち着かせる。背後に
          格子の面を敷いて、写真の余白を埋める。 */}
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div
          aria-hidden
          className="bg-dots-light absolute -right-4 -top-6 h-3/5 w-3/5 sm:-right-8"
        />
        <div
          aria-hidden
          className="absolute -bottom-5 left-[6%] h-2/5 w-2/5 rounded-2xl bg-gradient-to-br from-accent/20 to-cyan/10"
        />
        <div data-reveal="mask" className="relative">
          <Image
            src="/about/intro.webp"
            alt=""
            aria-hidden
            width={960}
            height={1117}
            sizes="(min-width: 1024px) 32rem, 90vw"
            className="reveal-zoom h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}

/** 各領域の経験年数。数字は画面に入ったときに数え上げる。 */
function Numbers() {
  return (
    <div className="mt-24">
      <div data-reveal className="flex items-end justify-between gap-6">
        <p className="flex items-center gap-3 text-sm font-bold tracking-wide text-ink">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-accent" />
          各領域の経験年数
        </p>
        <p className="hidden font-display text-xs font-semibold tracking-[0.24em] text-muted sm:block">
          YEARS OF EXPERIENCE
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {EXPERIENCE.map((e, i) => (
          <div
            key={e.key}
            data-reveal
            style={revealDelay(i, 110)}
            className="flex flex-col bg-card px-6 py-8 sm:px-8 sm:py-10"
          >
            <dt className="order-last mt-3 text-sm font-bold text-ink-soft sm:text-base">
              {e.label}
            </dt>
            <dd className="flex items-baseline gap-1.5">
              <span className="sr-only">{e.label}の経験：</span>
              <CountUp
                value={e.years}
                className="font-display text-[3.25rem] font-extrabold leading-none tracking-tight text-gradient tabular-nums sm:text-7xl"
              />
              <span className="whitespace-nowrap text-sm font-bold text-ink sm:text-lg">
                年以上
              </span>
            </dd>
            <span
              aria-hidden
              className="order-first mb-5 font-display text-[0.7rem] font-semibold tracking-[0.24em] text-accent-ink"
            >
              {e.en}
            </span>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** トップページのチーム紹介。4枚のカードから /about の該当チームへ飛ぶ。 */
function TeamCards() {
  return (
    <div className="mt-24">
      <div data-reveal className="flex items-end justify-between gap-6">
        <p className="flex items-center gap-3 text-sm font-bold tracking-wide text-ink">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-accent" />
          4つの専門チーム
        </p>
        <p className="hidden font-display text-xs font-semibold tracking-[0.24em] text-muted sm:block">
          SPECIALIST TEAMS
        </p>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TEAMS.map((team, i) => (
          <li key={team.no} data-reveal style={revealDelay(i, 110)}>
            <Link
              href={`/about#${team.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_24px_60px_rgb(0_45_120_/_0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {/* 上端の光の線。ホバーで左から伸びる。 */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-accent via-cyan to-violet transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between">
                <span
                  aria-hidden
                  className="font-display text-5xl font-extrabold leading-none text-accent/25 transition-colors duration-500 group-hover:text-accent/60"
                >
                  {team.no}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-accent-ink transition-colors duration-500 group-hover:bg-accent group-hover:text-white">
                  <DomainIcon kind={team.kind} />
                </span>
              </div>
              <p className="mt-7 font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-ink">
                {team.en}
              </p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-ink">
                {team.ja}
              </h3>
              <p className="mt-4 text-sm leading-[1.95] text-ink-soft">
                {team.mission}
              </p>
              {/* 代表的な技術だけ。全量は /about に載せている。 */}
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {team.stack.slice(0, 4).map((t) => (
                  <TechChip key={t} name={t} size="sm" />
                ))}
              </ul>
              <span className="mt-auto block pt-7">
                <span className="flex items-center justify-between border-t border-line pt-5 text-sm font-bold text-ink transition-colors duration-300 group-hover:text-accent-ink">
                  チームの詳細を見る
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** /about のチーム詳細。チームごとにネイビーの見出し帯と本文の二段。 */
function TeamList() {
  return (
    <ol className="mt-24 space-y-10">
      {TEAMS.map((team) => (
        <li
          key={team.no}
          // トップページの「チームの詳細を見る」からの着地点。
          // `scroll-mt` は固定ヘッダーぶんの逃げ。
          id={team.slug}
          className="scroll-mt-28"
        >
          <article
            data-reveal
            className="overflow-hidden rounded-3xl border border-line bg-card text-left"
          >
            <div className="navy-field relative isolate grid items-center gap-8 p-7 text-white sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
              <div aria-hidden className="bg-grid-dark absolute inset-0 -z-10" />
              <div>
                <div className="flex items-center gap-5">
                  <span
                    aria-hidden
                    className="font-display text-5xl font-extrabold leading-none text-white/30 sm:text-6xl"
                  >
                    {team.no}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-white/15" />
                </div>
                <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
                  {team.en}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {team.ja}
                </h3>
                <div className="mt-7">
                  <BlockLabel tone="onDark">私たちの使命</BlockLabel>
                  <p className="mt-2 text-lg font-bold leading-relaxed sm:text-xl">
                    {team.mission}
                  </p>
                </div>
                <div className="mt-6">
                  <BlockLabel tone="onDark">チーム紹介</BlockLabel>
                  <p className="mt-2 text-base leading-[2] text-white/80">
                    {team.intro}
                  </p>
                </div>
              </div>
              <DomainArt kind={team.kind} className="mx-auto max-w-md" />
            </div>

            {/* 3つのブロックを横一列に。狭い画面では縦積みに戻る。 */}
            <div className="grid items-start gap-10 p-7 sm:p-10 lg:grid-cols-3">
              <div>
                <BlockLabel>対応業界</BlockLabel>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {team.industries.map((i) => (
                    <li
                      key={i}
                      className="rounded-full bg-surface px-3.5 py-1.5 text-sm text-ink-soft"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <BlockLabel>主なサービス</BlockLabel>
                <ul className="mt-4 space-y-2">
                  {team.services.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft"
                    >
                      <Tick />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <BlockLabel>技術スタック</BlockLabel>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {team.stack.map((t) => (
                    <TechChip key={t} name={t} />
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

/** チェックマーク。先頭行のベースラインに合わせて少し下げる。 */
function Tick() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="mt-[0.2em] h-4 w-4 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

/** 締めの「ひとつのチーム、多様な専門性」。/about のみ。 */
function Closing() {
  return (
    <div
      data-reveal
      className="navy-field relative isolate mt-24 overflow-hidden rounded-3xl px-7 py-16 text-center text-white sm:px-12 sm:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url(/about/closing.webp)] bg-cover bg-center opacity-25 mix-blend-luminosity" />
        <div className="bg-grid-dark absolute inset-0" />
        <div className="aurora aurora-blue -left-[20%] -top-[60%] h-[34rem] w-[34rem]" />
      </div>
      {/* 英語を小さなラベル、日本語を主見出しに。 */}
      <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-cyan sm:text-base">
        One Team, Multiple Expertise
      </p>
      <h3 className="mt-4 text-[1.75rem] font-black leading-tight tracking-tight sm:text-4xl xl:text-5xl">
        ひとつのチーム、多様な専門性
      </h3>
      <div className="mx-auto mt-8 max-w-3xl space-y-4 text-base leading-[2.05] text-white/80 sm:text-lg">
        <p>
          私たちは4つの専門チームが連携することで、単なる制作会社ではなく、
          <strong className="font-bold text-white">
            「ビジネス課題を技術で解決する開発パートナー」
          </strong>
          として価値を提供しています。
        </p>
        <p>
          Web制作からシステム・アプリ・AIまで、一つの窓口で一貫して対応できることがWEB-XR.studioの強みです。
        </p>
      </div>
    </div>
  );
}

export function About({
  /** Hide the section header on /about, where PageHero already shows it. */
  showHeader = true,
  /**
   * チームの見せ方。トップページは4枚のカードで概要を見せる "summary"、
   * /about は全チームの詳細を並べる "full"。締めの一文も "full" のみ。
   */
  variant = "full",
}: {
  showHeader?: boolean;
  variant?: "summary" | "full";
} = {}) {
  const summary = variant === "summary";
  return (
    <Section id="about">
      <Intro showHeader={showHeader} />
      <Numbers />
      {summary ? <TeamCards /> : <TeamList />}
      {!summary && <Closing />}
      {/* トップページのときだけ、全チームを載せた /about へ誘導する。 */}
      {summary && (
        <SectionLink href="/about">私たちについて詳しく見る</SectionLink>
      )}
    </Section>
  );
}
