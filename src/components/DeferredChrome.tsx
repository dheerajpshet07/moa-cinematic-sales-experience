"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const ClientChrome = lazy(() => import("@/components/ClientChrome"));

export default function DeferredChrome() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    const observeRevealNodes = (root: ParentNode = document) => {
      root.querySelectorAll("[data-reveal]").forEach((node) => {
        if (!node.classList.contains("is-visible")) {
          revealObserver.observe(node);
        }
      });
    };

    const revealAll = (root: ParentNode = document) => {
      root.querySelectorAll("[data-reveal]").forEach((node) => {
        node.classList.add("is-visible");
      });
    };

    let timeout = 0;
    let fallback = 0;
    let mutationObserver: MutationObserver | null = null;

    const activate = () => {
      timeout = window.setTimeout(() => setActive(true), 6000);
    };

    observeRevealNodes();
    fallback = window.setTimeout(() => revealAll(), 3200);
    mutationObserver = new MutationObserver((entries) => {
      entries.forEach((entry) => {
        entry.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]")) {
              revealObserver.observe(node);
            }
            observeRevealNodes(node);
            window.setTimeout(() => revealAll(node), 900);
          }
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === "complete") {
      activate();
    } else {
      window.addEventListener("load", activate, { once: true });
    }

    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(fallback);
      window.removeEventListener("load", activate);
      mutationObserver?.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  if (!active) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ClientChrome />
    </Suspense>
  );
}
