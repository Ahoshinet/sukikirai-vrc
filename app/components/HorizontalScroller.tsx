"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HorizontalScroller({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const maxScroll = element.scrollWidth - element.clientWidth;
      const atStart = element.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = element.scrollLeft >= maxScroll - 1 && event.deltaY > 0;
      if (atStart || atEnd) {
        return;
      }

      event.preventDefault();
      element.scrollLeft += event.deltaY;
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
