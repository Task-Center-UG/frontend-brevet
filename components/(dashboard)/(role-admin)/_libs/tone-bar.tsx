import * as React from "react";

export const ToneBar: React.FC<{ tone?: "primary" | "warning" | "danger" }> = ({
  tone = "primary",
}) => (
  <div
    className={[
      "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
      tone === "primary" && "from-primary/40 via-primary/20 to-transparent",
      tone === "warning" &&
        "from-orange-500/30 via-orange-500/10 to-transparent",
      tone === "danger" &&
        "from-destructive/40 via-destructive/20 to-transparent",
    ]
      .filter(Boolean)
      .join(" ")}
    aria-hidden
  />
);
