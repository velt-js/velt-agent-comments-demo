"use client";

import { useEffect } from "react";

// The composer should look the same before and after a comment's ⋯ menu opens: open
// stays open, collapsed stays collapsed. Menus take focus on mousedown, so keep focus
// where it is. The menu still opens on click.
export function KeepComposerFocus() {
  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".vc-comment-options-trigger, .vc-options-trigger")) {
        event.preventDefault();
      }
    };
    document.addEventListener("mousedown", onMouseDown, true);
    return () => document.removeEventListener("mousedown", onMouseDown, true);
  }, []);

  return null;
}

export default KeepComposerFocus;
