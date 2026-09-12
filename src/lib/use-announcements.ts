import { useQuery } from "@tanstack/react-query";

import { fetchPublicAnnouncements, type Announcement } from "./announcements";

/**
 * Announcements for a public page. Starts from whatever the route loader
 * produced (server render, or build time for the static GitHub Pages export)
 * and refreshes in the browser on mount so new posts from /admin show up
 * without a rebuild.
 */
export function useAnnouncements(initial: Announcement[], limit?: number): Announcement[] {
  const { data } = useQuery({
    queryKey: ["announcements", limit ?? "all"],
    queryFn: () => fetchPublicAnnouncements(limit),
    initialData: initial,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  return data;
}
