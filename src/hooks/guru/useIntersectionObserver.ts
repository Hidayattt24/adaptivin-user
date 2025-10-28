import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = "0px",
  triggerOnce = false,
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            if (triggerOnce) {
              hasTriggered.current = true;
            }
          } else if (!triggerOnce) {
            setIsIntersecting(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { targetRef, isIntersecting };
}
