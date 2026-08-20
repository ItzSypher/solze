import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";

declare global {
  interface Window {
    Instafeed: any;
  }
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800",
  "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800",
  "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800",
  "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
];

export function InstagramFeed({
  handle = "@solze",
  title = "#SOUFORTECOMOSOLZE",
  eyebrow = "Comunidade Solze no Instagram",
}: {
  handle?: string;
  title?: string;
  eyebrow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const token = import.meta.env.VITE_INSTAGRAM_TOKEN as string | undefined;
  const limit = Number(import.meta.env.VITE_INSTAGRAM_LIMIT ?? 10);

  useEffect(() => {
    let cancelled = false;
    if (!token || !ref.current) return;
    (async () => {
      const mod = await import("instafeed.js");
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = "";
      const Instafeed = (mod as any).default ?? (mod as any);
      const feed = new Instafeed({
        accessToken: token,
        limit,
        target: ref.current,
        template:
          '<a href="{{link}}" target="_blank" rel="noopener noreferrer" class="group relative aspect-square rounded-[20px] overflow-hidden block bg-neutral-100">' +
          '<img src="{{image}}" alt="{{caption}}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />' +
          '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"><svg class="opacity-0 group-hover:opacity-100 transition-opacity text-white" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></div>' +
          "</a>",
      });
      feed.run();
    })();
    return () => {
      cancelled = true;
    };
  }, [token, limit]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-16">
      <div className="text-center mb-6">
        <p className="font-display uppercase tracking-[0.25em] text-xs text-neutral-500">
          {eyebrow}
        </p>
        <h2 className="font-display uppercase text-3xl lg:text-4xl mt-1">
          {title}
        </h2>
        <a
          href={`https://instagram.com/${handle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mt-2"
        >
          <Instagram className="h-4 w-4" /> {handle}
        </a>
      </div>

      {token ? (
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {FALLBACK_IMAGES.map((src, i) => (
              <a
                key={i}
                href={`https://instagram.com/${handle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-[20px] overflow-hidden block"
              >
                <img
                  src={src}
                  alt={`Instagram ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Instagram className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-400 mt-4">
            Configure <code>VITE_INSTAGRAM_TOKEN</code> no .env para exibir o feed real via Instafeed.
          </p>
        </>
      )}
    </section>
  );
}
