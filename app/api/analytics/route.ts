import { NextResponse } from "next/server";
import { createAnalyticsEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventName?: string;
      entityType?: string;
      entityId?: string;
      path?: string;
      productSlug?: string;
      payload?: unknown;
      metadata?: unknown;
    };

    const allowedEvents = new Set(["page_view", "product_view", "contact_form_submit", "add_to_cart", "remove_from_cart", "cart_quantity_change", "checkout_submit", "error", "checkout_start"]);
    if (!body.eventName || !allowedEvents.has(body.eventName)) {
      return NextResponse.json({ ok: false, error: "eventName is required" }, { status: 400 });
    }

    await createAnalyticsEvent({
      eventName: body.eventName,
      entityType: body.entityType,
      entityId: body.entityId,
      path: body.path,
      productSlug: body.productSlug,
      payload: body.payload,
      metadata: body.metadata
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
