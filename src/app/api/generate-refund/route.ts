import { NextResponse } from "next/server";
import { refundSchema } from "@/lib/schema";
import { buildFilename, generateRefundWorkbook } from "@/lib/excel-fill";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = refundSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let buf: Buffer;
  try {
    buf = await generateRefundWorkbook(parsed.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate workbook";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const filename = buildFilename(parsed.data);
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
