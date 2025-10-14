"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function MetaPixelCookies() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capture fbclid from URL (for _fbc)
    const fbclid = searchParams.get("fbclid");
    if (fbclid) {
      document.cookie = `_fbc=${fbclid}; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
    }

    // Capture _fbp if available from Meta Pixel (optional)
    // Meta Pixel sets _fbp automatically, we can read it and save to cookie if needed
    const fbpCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("_fbp="))
      ?.split("=")[1];
    if (fbpCookie) {
      document.cookie = `_fbp=${fbpCookie}; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
    }
  }, [searchParams]);

  return null; // this component doesn't render anything
}