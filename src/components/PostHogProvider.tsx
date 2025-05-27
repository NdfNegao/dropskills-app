"use client";
import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
    });
  }, []);
  return null;
} 