import * as simpleIcons from "simple-icons";
import { cn } from "@/lib/utils";

/**
 * Brand logo for a technology name, drawn from `simple-icons`.
 *
 * Names in the content don't always match the icon set's titles (e.g. "SCSS"
 * ships as "Sass", "AWS" has no icon at all because Amazon restricts its mark),
 * so `TITLE_OVERRIDES` maps our wording onto theirs and anything unresolved
 * renders as a plain text chip instead.
 */

type SimpleIcon = simpleIcons.SimpleIcon;

const ALL = Object.values(simpleIcons).filter(
  (i): i is SimpleIcon =>
    typeof i === "object" && i !== null && "path" in i && "title" in i,
);

const BY_TITLE = new Map(ALL.map((i) => [i.title.toLowerCase(), i]));

// Our label -> the icon set's title. Only needed where the two differ.
const TITLE_OVERRIDES: Record<string, string> = {
  scss: "Sass",
  css3: "CSS",
  "vue.js": "Vue.js",
  "nuxt.js": "Nuxt",
  "react native": "React",
  "spring boot": "Spring Boot",
  "ruby on rails": "Ruby on Rails",
  "google cloud": "Google Cloud",
  gemini: "Google Gemini",
  langgraph: "LangChain",
  llamaindex: "LlamaIndex",
  "hugging face": "Hugging Face",
  "rest api": "OpenAPI Initiative",
  "azure ai": "Microsoft",
  "vertex ai": "Google Cloud",
  ".net": "dotnet",
  "c#": "C Sharp",
};

/** Resolve a display name to an icon, or null when the brand has none. */
function resolve(name: string): SimpleIcon | null {
  const key = name.trim().toLowerCase();
  const mapped = TITLE_OVERRIDES[key];
  if (mapped) {
    const hit = BY_TITLE.get(mapped.toLowerCase());
    if (hit) return hit;
  }
  return BY_TITLE.get(key) ?? null;
}

export function TechIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const icon = resolve(name);
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 shrink-0", className)}
      // The brand's own colour, so the chips read as a logo wall.
      fill={`#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

/**
 * A tech chip: logo (when one exists) plus the name.
 * `size="sm"` is the compact pill used inside cards; `"lg"` is the larger
 * pill of the technology marquee.
 */
export function TechChip({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <li
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-line bg-card text-ink-soft",
        size === "sm" && "gap-1.5 px-2.5 py-1 text-xs",
        size === "md" && "gap-2 px-3 py-1.5 text-sm",
        size === "lg" &&
          "gap-3 px-5 py-3 text-[0.95rem] font-medium text-ink shadow-[0_4px_18px_rgb(13_16_23_/_0.05)]",
      )}
    >
      <TechIcon
        name={name}
        className={size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3.5 w-3.5" : undefined}
      />
      {name}
    </li>
  );
}
