"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const analyticsConsentKey = "kartofert_cookie_consent";
const consentEventName = "kartofert-cookie-consent-changed";

type AnalyticsEventName = "page_view" | "product_view" | "contact_form_submit" | "add_to_cart" | "error";

type AnalyticsPayload = {
  eventName: AnalyticsEventName;
  path?: string;
  productSlug?: string;
  payload?: Record<string, unknown>;
};

export function notifyAnalyticsConsentChanged(value: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(consentEventName, { detail: value }));
}

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(analyticsConsentKey) === "accepted";
}

export function trackAnalyticsEvent(event: AnalyticsPayload) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  const body = JSON.stringify({
    eventName: event.eventName,
    path: event.path ?? `${window.location.pathname}${window.location.search}`,
    productSlug: event.productSlug,
    payload: sanitizePayload(event.payload)
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
      return;
    }
  } catch {
    // fetch fallback below
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef("");

  useEffect(() => {
    const trackCurrentPage = () => {
      if (!hasAnalyticsConsent()) return;
      const search = window.location.search;
      const path = `${pathname}${search ? `?${search}` : ""}`;
      if (lastTrackedPath.current === path) return;
      lastTrackedPath.current = path;

      const productSlug = getProductSlug(pathname);
      trackAnalyticsEvent({
        eventName: productSlug ? "product_view" : "page_view",
        path,
        productSlug,
        payload: productSlug ? { source: "product_page" } : undefined
      });

      if (productSlug) {
        trackAnalyticsEvent({
          eventName: "page_view",
          path,
          productSlug,
          payload: { pageType: "product" }
        });
      }
    };

    trackCurrentPage();
    window.addEventListener(consentEventName, trackCurrentPage);
    return () => window.removeEventListener(consentEventName, trackCurrentPage);
  }, [pathname]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      trackAnalyticsEvent({
        eventName: "error",
        payload: {
          kind: "client_error",
          message: event.message,
          source: event.filename ? "browser" : "unknown"
        }
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackAnalyticsEvent({
        eventName: "error",
        payload: {
          kind: "unhandled_rejection",
          message: String(event.reason instanceof Error ? event.reason.message : event.reason ?? "unknown")
        }
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}

function getProductSlug(pathname: string) {
  const match = pathname.match(/^\/products\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function sanitizePayload(payload: AnalyticsPayload["payload"]) {
  if (!payload) return undefined;
  const blockedKeys = new Set(["name", "email", "phone", "tel", "message", "comment", "customerName", "customerEmail", "customerPhone"]);
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !blockedKeys.has(key)));
}
