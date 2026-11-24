import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { About } from "@/components/sections/About";
import { Strengths } from "@/components/sections/Strengths";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";

// The ABOUT US content is editorial copy held in the components, not
// DB-backed, so this page needs no data fetch — but the shared layout still
// reads settings, so `force-dynamic` stays.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "私たちについて",
  description:
    "Web・システム・アプリ・AIの専門性を掛け合わせ、企画から運用までワンストップでご提供します。",
};

/**
 * 私たちについて。導入・経験年数・締めの一文のあとに、選ばれる理由、
 * 開発の流れ、対応技術を続ける。
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        en="ABOUT US"
        title="私たちについて"
        description="Web・システム・アプリ・AIを専門とするエンジニア・デザイナーの開発スタジオです。"
        image="/about/hero.webp"
      />
      <About showHeader={false} />
      <Strengths />
      <Process />
      <TechStack />
    </>
  );
}
