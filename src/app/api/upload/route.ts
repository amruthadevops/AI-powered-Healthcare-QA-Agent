import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);
    const parsed = await pdfParse(pdfBuffer);

    return NextResponse.json({ text: parsed.text }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 PDF upload crash:", err);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
