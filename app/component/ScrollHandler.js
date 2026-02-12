"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Using a Named Export instead of Default
const ScrollHandler = () => {
  const pathname = usePathname();

  useEffect(() => {
    // We wrap it in a timeout to ensure the DOM has rendered 
    // before we force the scroll to the top
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // 'instant' prevents the weird sliding animation
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
export default ScrollHandler;