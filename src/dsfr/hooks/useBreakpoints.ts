import { breakpoints } from "@codegouvfr/react-dsfr/fr/breakpoints";
import { useEffect, useState } from "react";

export const useBreakpoints = () => {
  const [isSmAndUp, setIsSmAndUp] = useState(false);
  const [isMdAndUp, setIsMdAndUp] = useState(false);
  const [isLgAndUp, setIsLgAndUp] = useState(false);
  const [isXlAndUp, setIsXlAndUp] = useState(false);

  useEffect(() => {
    const [smMediaWatcher, mdMediaWatcher, lgMediaWatcher, xlMediaWatcher] = (["sm", "md", "lg", "xl"] as const).map(
      breakpoint => window.matchMedia(breakpoints.up(breakpoint).replace("@media ", "")),
    );

    setIsSmAndUp(smMediaWatcher.matches);
    setIsMdAndUp(mdMediaWatcher.matches);
    setIsLgAndUp(lgMediaWatcher.matches);
    setIsXlAndUp(xlMediaWatcher.matches);

    const [smListener, mdListener, lgListener, xlListener] = [
      setIsSmAndUp,
      setIsMdAndUp,
      setIsLgAndUp,
      setIsXlAndUp,
    ].map(setBreakpoint => {
      return (event: MediaQueryListEvent) => setBreakpoint(event.matches);
    });

    if (smMediaWatcher.addEventListener) {
      smMediaWatcher.addEventListener("change", smListener);
      mdMediaWatcher.addEventListener("change", mdListener);
      lgMediaWatcher.addEventListener("change", lgListener);
      xlMediaWatcher.addEventListener("change", xlListener);

      return function cleanup() {
        smMediaWatcher.removeEventListener("change", smListener);
        mdMediaWatcher.removeEventListener("change", mdListener);
        lgMediaWatcher.removeEventListener("change", lgListener);
        xlMediaWatcher.removeEventListener("change", xlListener);
      };
    }

    smMediaWatcher.addListener(smListener);
    mdMediaWatcher.addListener(mdListener);
    lgMediaWatcher.addListener(lgListener);
    xlMediaWatcher.addListener(xlListener);

    return function cleanup() {
      smMediaWatcher.removeListener(smListener);
      mdMediaWatcher.removeListener(mdListener);
      lgMediaWatcher.removeListener(lgListener);
      xlMediaWatcher.removeListener(xlListener);
    };
  }, []);

  return { isSmAndUp, isMdAndUp, isLgAndUp, isXlAndUp };
};
