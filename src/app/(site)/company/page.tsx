import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { CompanyHistory } from "@/components/sections/CompanyHistory";
import { CompanyProfile } from "@/components/sections/CompanyProfile";
import { getCompany } from "@/lib/content";

export const dynamic = "force-dynamic";

// ミッションは company.mission（管理画面で編集可）にあるが、ビジョンに対応する
// 項目はスキーマにないため、ここで定数として保持する。
const VISION =
  "テクノロジーの力で、企業と社会の可能性を最大化し、日本を代表するIT企業へ。";

export const metadata: Metadata = {
  title: "会社案内",
  description:
    "WEB-XR.studioの会社概要。所在地、連絡先、沿革、企業理念をご案内します。",
};

export default async function CompanyPage() {
  const company = await getCompany();

  return (
    <>
      <PageHero
        en="COMPANY"
        title="会社案内"
        description="会社概要と沿革、私たちが大切にしている考え方をご紹介します。"
        image="/about/fv-company.webp"
      />

      <CompanyProfile />

      <CompanyHistory />

      {/* ビジョンとミッションを対で見せる。ミッションは DB（管理画面で編集可）、
          ビジョンは対応する項目がないためこのページの定数。 */}
      <Section
        id="philosophy"
        tone="stage"
        align="center"
        eyebrow="PHILOSOPHY"
        title="企業理念"
        backdrop={
          <>
            <div className="bg-grid absolute inset-0" />
            <div className="aurora aurora-blue -left-[10%] -top-[30%] h-[40rem] w-[40rem]" />
            <div className="aurora aurora-violet -bottom-[40%] -right-[10%] h-[40rem] w-[40rem]" />
          </>
        }
      >
        <div className="mx-auto grid max-w-5xl gap-6 text-left md:grid-cols-2">
          <div
            data-reveal
            className="rounded-3xl border border-on-stage/10 bg-stage-card p-8 backdrop-blur-sm sm:p-12 light:border-line light:shadow-[0_12px_40px_rgb(0_45_120_/_0.07)]"
          >
            <p className="font-display text-sm font-semibold tracking-[0.26em] text-stage-accent">
              VISION
            </p>
            <h3 className="mt-2 text-base font-bold text-on-stage/80">ビジョン</h3>
            <p className="mt-6 text-xl font-black leading-[1.75] sm:text-2xl">
              {VISION}
            </p>
          </div>

          {company?.mission && (
            <div
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              className="rounded-3xl border border-on-stage/10 bg-stage-card p-8 backdrop-blur-sm sm:p-12 light:border-line light:shadow-[0_12px_40px_rgb(0_45_120_/_0.07)]"
            >
              <p className="font-display text-sm font-semibold tracking-[0.26em] text-stage-accent">
                MISSION
              </p>
              <h3 className="mt-2 text-base font-bold text-on-stage/80">
                ミッション
              </h3>
              <p className="mt-6 whitespace-pre-line text-xl font-black leading-[1.75] sm:text-2xl">
                {company.mission}
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
