import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const registerGSAP = () => {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
};

export const ANIMATION_CONFIG = {
  durations: {
    micro: 0.2, // 200ms Hover, focus
    ui: 0.4, // 400ms Transitions UI standards
    editorial: 0.8, // 800ms Reveale editorial, page transitions
  },
  easings: {
    entrance: "power3.out", // Naturel décéléré
    exit: "power2.in", // Rapide accélération
    continuous: "power2.inOut",
    bounce: "back.out(1.2)",
  },
};

// Vérifie si l'utilisateur requiert peu de mouvement
export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Helper pour des révélations (Fade + Y)
export const revealFromBottom = (element: Element | string, delay: number = 0) => {
  if (shouldReduceMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  // Check if element exists before animating
  const target = typeof element === "string" ? document.querySelector(element) : element;
  if (!target) return;
  
  gsap.fromTo(
    target,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.durations.editorial,
      ease: ANIMATION_CONFIG.easings.entrance,
      delay: delay,
      scrollTrigger: {
        trigger: target as any,
        start: "top 85%", // Démarre quand le top est à 85% de la fenêtre
        toggleActions: "play none none reverse", // Se joue à l'entrée, s'inverse si on remonte haut
      },
    }
  );
};

export const staggerReveal = (elements: Element[] | string, staggerAmount: number = 0.1) => {
  if (shouldReduceMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

  // Check if elements exist before animating
  const targets = typeof elements === "string" ? document.querySelectorAll(elements) : elements;
  if (!targets || (Array.isArray(targets) && targets.length === 0) || (targets instanceof NodeList && targets.length === 0)) return;
  
  gsap.fromTo(
    targets,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.durations.editorial,
      ease: ANIMATION_CONFIG.easings.entrance,
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: targets[0] as any, // Use the first element as trigger
        start: "top 85%",
      },
    }
  );
};
