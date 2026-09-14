"use client";

import { useEffect } from "react";
import { useVeltClient } from "@veltdev/react";

// [Velt] The customization is authored against Velt's unstyled DOM.
// `keepFunctionalStyles` keeps layout and positioning, drops the cosmetic defaults.
export function VeltUnstyledMode() {
  const { client } = useVeltClient();

  useEffect(() => {
    if (!client) return;
    client.setUnstyledMode(true, { keepFunctionalStyles: true });
  }, [client]);

  return null;
}

export default VeltUnstyledMode;
