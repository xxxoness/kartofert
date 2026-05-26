import { NextResponse } from "next/server";
import { createAnalyticsEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventName?: string;
      entityType?: string;
      entityId?: string;
      path?: string;
      metadata?: unknown;
    };

    if (!body.eventName) {
      return NextResponse.json({ ok: false, error: "eventName is required" }, { status: 400 });
    }

    await createAnalyticsEvent({
      eventName: body.eventName,
      entityType: body.entityType,
      entityId: body.entityId,
      path: body.path,
      metadata: body.metadata
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
