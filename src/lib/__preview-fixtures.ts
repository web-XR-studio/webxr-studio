// TEMPORARY — local visual preview only (no database here). Deleted after the
// check; content.ts is reverted with git.
import type { Company, Faq, Portfolio, SiteSettings } from "@/db/schema";

const now = new Date();

export const PREVIEW_COMPANY: Company = {
  id: 1,
  name: "WEB-XR.studio",
  tagline: "Web・アプリ・AIで、事業の次の一手をつくる。",
  about: "",
  mission:
    "テクノロジーの力で、お客様のビジネスに新しい可能性を届けること。作って終わりではなく、育て続けるパートナーであること。",
  history: "",
  stats: [],
  updatedAt: now,
};

const review =
  "初めての相談から公開後の改善まで、こちらの事業を理解したうえで提案していただきました。打ち合わせのたびに選択肢と理由を示してくれるので、安心して判断できました。";

export const PREVIEW_PORTFOLIO: Portfolio[] = [
  ["スクロール演出のブランドLP", "/history/2018.webp", "小売・EC", "株式会社サンプル", "山田 太郎"],
  ["オーガニック食品ECサイト", "/history/2020.webp", "食品", "グリーンマート株式会社", "佐藤 花子"],
  ["セキュリティ企業向けWebシステム", "/history/2023.webp", "セキュリティ", "セーフティ株式会社", "鈴木 一郎"],
  ["教育ポータル & 管理システム", "/history/2016.webp", "教育", "ラーニング学園", "高橋 美咲"],
].map(([title, imageUrl, industry, companyName, clientName], i) => ({
  id: i + 1,
  title,
  description: "業務フローに合わせた管理機能と、使いやすさを両立したプロジェクトです。",
  tags: ["Next.js", "TypeScript", "PostgreSQL"],
  imageUrl,
  workImageUrl: "",
  thumbnailUrl: "",
  gallery: [],
  link: "",
  review,
  companyName,
  clientName,
  industry,
  order: i + 1,
  createdAt: now,
  updatedAt: now,
}));

export const PREVIEW_FAQS: Faq[] = [
  ["対応可能な開発領域を教えてください。", "Web制作、システム開発、モバイルアプリ開発（iOS/Android/Flutter）、AI・ChatGPT連携まで幅広く対応しています。"],
  ["小規模な案件でも相談できますか？", "はい。ランディングページ1枚から大規模システムまで、規模を問わずご相談いただけます。"],
  ["納品後の運用・保守もお願いできますか？", "もちろんです。私たちは「作って終わり」ではなく、公開後の運用・改善まで伴走することを大切にしています。"],
  ["見積もりは無料ですか？", "はい、お見積もり・ご相談は無料です。お問い合わせフォームよりお気軽にご連絡ください。"],
].map(([question, answer], i) => ({
  id: i + 1,
  question,
  answer,
  order: i + 1,
  createdAt: now,
  updatedAt: now,
}));

export const PREVIEW_SETTINGS: SiteSettings = {
  id: 1,
  contactEmail: "contact@example.com",
  phone: "03-0000-0000",
  address: "東京都千代田区サンプル1-2-3",
  socials: [],
  seoTitle: "",
  seoDescription: "",
  updatedAt: now,
};
