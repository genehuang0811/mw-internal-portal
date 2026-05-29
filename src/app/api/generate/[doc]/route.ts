import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { generateDocument } from "@/lib/documents/engine";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ doc: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { doc } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const outcome = await generateDocument(doc, body);
  if (!outcome.ok) {
    return NextResponse.json(
      { error: outcome.error, issues: outcome.issues },
      { status: outcome.status },
    );
  }

  const { buffer, filename, contentType } = outcome.result;
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
