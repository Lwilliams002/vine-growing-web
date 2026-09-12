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

/** Fallback when no video URL is configured: the page's Facebook timeline. */
export function FacebookPageFeed({ className = "" }: { className?: string }) {
  const src =
    "https://www.facebook.com/plugins/page.php?" +
    new URLSearchParams({
      href: CHURCH.facebook,
      tabs: "timeline",
      width: "500",
      height: "700",
      small_header: "true",
      adapt_container_width: "true",
      hide_cover: "false",
      show_facepile: "false",
    }).toString();

  return (
    <div className={`w-full overflow-hidden bg-black ${className}`}>
      <iframe
        title="The Vine on Facebook"
        src={src}
        className="h-[700px] w-full border-0"
        loading="lazy"
        allow="encrypted-media"
      />
    </div>
  );
}
