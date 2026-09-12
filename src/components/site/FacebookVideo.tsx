import { useEffect, useRef, useState } from "react";

import { CHURCH } from "@/lib/church";

/**
 * Embeds a public Facebook video (live stream, replay, or reel) with
 * Facebook's own player, so people can watch without leaving the site.
 * Facebook only allows embedding a specific video URL, not "whatever is
 * live right now"; the pastor pastes the live post's link into /admin.
 */
export function FacebookVideo({
  url,
  title,
  autoplay = false,
  className = "",
}: {
  url: string;
  title: string;
  autoplay?: boolean;
  className?: string;
}) {
  const src =
    "https://www.facebook.com/plugins/video.php?" +
    new URLSearchParams({
      href: url,
      show_text: "false",
      autoplay: autoplay ? "true" : "false",
      allowfullscreen: "true",
      width: "1280",
    }).toString();

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-black ${className}`}>
      <iframe
        title={title}
        src={src}
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

/**
 * Fallback when no video URL is configured: the page's Facebook timeline.
 * Facebook's page plugin needs an explicit pixel width (180 to 500), so we
 * measure the container and rebuild the embed when it resizes; otherwise the
 * feed overflows on phones.
 */
export function FacebookPageFeed({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.max(180, Math.min(500, Math.floor(el.clientWidth))));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = 640;
  const src =
    width === null
      ? null
      : "https://www.facebook.com/plugins/page.php?" +
        new URLSearchParams({
          href: CHURCH.facebook,
          tabs: "timeline",
          width: String(width),
          height: String(height),
          small_header: "true",
          adapt_container_width: "true",
          hide_cover: "false",
          show_facepile: "false",
        }).toString();

  return (
    <div ref={ref} className={`flex w-full justify-center overflow-hidden bg-card ${className}`}>
      {src ? (
        <iframe
          key={src}
          title="The Vine on Facebook"
          src={src}
          width={width ?? undefined}
          height={height}
          className="max-w-full border-0"
          loading="lazy"
          allow="encrypted-media"
        />
      ) : (
        <div style={{ height }} />
      )}
    </div>
  );
}
