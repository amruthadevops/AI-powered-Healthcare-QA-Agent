import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse"; // keep this since it's working locally
import type { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file received.");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);

    if (!data || !data.text) {
      console.error("PDF parse returned empty.");
      return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }

    return NextResponse.json({ text: data.text });
  } catch (err: any) {
    console.error("Error in upload route:", err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
