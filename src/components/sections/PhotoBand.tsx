import Image from "next/image";
import { revealDelay } from "@/lib/reveal";
import tokyoNight from "@/assets/photos/tokyo-night.webp";
import tokyoDay from "@/assets/photos/tokyo-day.webp";

/**
 * 写真の帯。画面いっぱいの街並みの写真を、スクロールより遅く動かして
 * 奥行きを出す（視差は SmoothScroll の `data-parallax`）。英字の大きな
 * 一文は行ごとに色の帯で覆ってから見せる。
 *
 * 写真は配色テーマに合わせて差し替える（ダークは夜景、ライトは昼の景色）。
 * 文字の側には面の色の幕を掛けて読ませる。
 */
export function PhotoBand() {
  return (
    <section
      aria-labelledby="photo-band-title"
      className="relative isolate flex min-h-[80svh] items-center overflow-hidden text-on-stage"
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* 動くぶん（上下 10%）だけ枠より大きくしておく。 */}
        <div data-parallax="10" className="absolute inset-x-0 -inset-y-[14%]">
          <Image
            src={tokyoNight}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover light:hidden"
          />
          <Image
            src={tokyoDay}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className="hidden object-cover light:block"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-field via-field/75 to-field/10" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-field/80 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[74.5rem] px-5 py-28">
        <p
          data-reveal
          className="inline-block bg-ink px-3.5 py-1.5 font-display text-xs font-medium tracking-[0.28em] text-white"
        >
          WEB × SYSTEM × APP × AI
        </p>
        <p
          aria-hidden
          className="mt-8 font-display text-[clamp(2.6rem,8.4vw,6.75rem)] font-medium uppercase leading-[1.02] tracking-[0.03em]"
        >
          <span data-reveal="block" className="inline-block">
            <span>One Partner,</span>
          </span>
          <br />
          <span
            data-reveal="block"
            style={revealDelay(1, 200)}
            className="inline-block"
          >
            <span>Multiple Expertise.</span>
          </span>
        </p>
        <h2
          id="photo-band-title"
          data-reveal
          style={revealDelay(2, 200)}
          className="mt-8 text-[1.6rem] font-black tracking-[0.12em] sm:text-3xl"
        >
          ひとつの窓口、多様な専門性
        </h2>
        <p
          data-reveal
          style={revealDelay(3, 200)}
          className="jp-phrase mt-6 max-w-xl text-base leading-[2.05] text-on-stage/80 sm:text-lg"
        >
          Web・システム・アプリ・AI。それぞれの専門性を掛け合わせ、企画から設計・開発・運用まで、ひとつの窓口で一貫してお応えします。
        </p>
      </div>
    </section>
  );
}
