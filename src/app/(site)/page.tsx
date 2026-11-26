import { Hero } from "@/components/sections/Hero";
import { Clients } from "@/components/sections/Clients";
import { PhotoBand } from "@/components/sections/PhotoBand";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Strengths } from "@/components/sections/Strengths";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { CompanyProfile } from "@/components/sections/CompanyProfile";
import { Faq } from "@/components/sections/Faq";
import { getCompany, getPortfolio, getFaqs } from "@/lib/content";

// Content is DB-driven and editable from the admin; render on each request so
// edits appear immediately.
export const dynamic = "force-dynamic";

/**
 * トップページ。ヘッダーの並び（私たちについて → 会社案内 → サービス →
 * お客様事例 → よくある質問）の順に各ページの概要を置き、サービスの後ろに
 * 「選ばれる理由」「開発の流れ」「対応技術」を挟む。
 *
 * ヒーローの直後に取引先の帯、「私たちについて」の後に写真の帯を挟む。
 *
 * 背景は ステージ（ヒーロー）→ 白 / 淡い青の交互 → 写真の帯 → … →
 * ステージ（強み）→ … → ステージ（問い合わせ帯）→ 最も深いステージ
 * （フッター）と切り替え、ページ全体に緩急をつけている。ステージの色は
 * 配色テーマで変わる（ライトは白と淡い青、ダークはネイビー）。
 */
export default async function HomePage() {
  const [company, portfolio, faqs] = await Promise.all([
    getCompany(),
    getPortfolio(),
    getFaqs(),
  ]);

  return (
    <>
      {/* 相談の入口（お問い合わせ）とサービス一覧への導線はヒーローの2つのボタン。
          右端のカードには事例の先頭2件を出す。 */}
      <Hero company={company} pickups={portfolio} />
      <Clients items={portfolio} />
      <About variant="summary" />
      <PhotoBand />
      {/* 会社概要のみ。沿革と企業理念は /company に置く。 */}
      <CompanyProfile
        eyebrow="COMPANY"
        title="会社案内"
        description="会社概要と沿革、私たちが大切にしている考え方をご紹介します。"
        tone="muted"
        showPageLink
      />
      <Services />
      <Strengths />
      <Process />
      <TechStack />
      {/* 件数が増えても縦に伸びないよう、全件を1枚ずつ送って見せる。 */}
      <CaseStudies
        items={portfolio}
        carousel
        showStack={false}
        eyebrow="CASE STUDY"
        title="お客様事例"
        description="課題の整理からデザイン、開発、その後の運用まで。お客様と伴走して形にしたプロジェクトと、いただいた声をご紹介します。"
        pageLink
      />
      <Faq faqs={faqs} tone="muted" />
    </>
  );
}
