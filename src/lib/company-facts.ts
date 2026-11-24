/**
 * 会社の数字。沿革（/company）とトップページの数字の帯が同じ値を使う。
 * 値を変えるときはここだけを直す。
 *
 * 管理画面の company.stats は使わない（初期データの「設立 2022年」が登記と
 * 食い違っていたため、表示には登記ベースのこの定数を使う）。
 */
export const EXPERIENCE = [
  { key: "web", en: "WEB", label: "Web制作", years: 10 },
  { key: "system", en: "SYSTEM", label: "システム開発", years: 8 },
  { key: "app", en: "APP", label: "アプリ開発", years: 6 },
  { key: "ai", en: "AI", label: "AI開発", years: 3 },
] as const;
