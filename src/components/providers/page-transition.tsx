"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ANIMATION_CONFIG, registerGSAP } from "@/lib/animations";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGSAP();
    
    // Initial page load animation
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-content",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.durations.editorial,
          ease: ANIMATION_CONFIG.easings.entrance,
          clearProps: "all"
        }
      );
    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="will-change-transform">
      <div className="page-content">{children}</div>
    </div>
  );
}
