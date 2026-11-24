import { UserRound } from "lucide-react";

/**
 * お客様のお写真が未登録のときに出す既定のアバター。
 *
 * 事例の一覧カードと詳細ページのバナーで共有する。写真の枠をそのまま
 * 埋めるので、`className` で高さや比率を指定して使う。
 */
export function AvatarFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-surface-2 ${className ?? ""}`}
    >
      {/* 人物のアイコン。色は一段薄くして、写真がある他のカードと並んだ
          ときに主張しすぎないようにする。 */}
      <UserRound strokeWidth={1.25} className="h-2/5 w-auto text-muted/45" />
    </div>
  );
}
