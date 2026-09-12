import { useQuery } from "@tanstack/react-query";

import { fetchSettings, type SiteSettings } from "./settings";

/**
 * Site settings for a public page. Starts from the route loader's value and
 * refreshes in the browser on mount, so flipping "En vivo" in /admin shows up
 * on the next page load without a rebuild.
 */
export function useSettings(initial: SiteSettings): SiteSettings {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
    initialData: initial,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
  return data;
}
