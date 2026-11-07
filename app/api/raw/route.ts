import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/rimraf-adi/sentinel-hub/main/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Sanitize path
  const cleanPath = filePath.replace(/^\/+/, "");

  try {
    const res = await fetch(`${GITHUB_RAW_BASE}${cleanPath}?_ts=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "User-Agent": "Sentinel-Hub-Client/1.0",
      },
    });

    if (res.ok) {
      const content = await res.text();
      return NextResponse.json({
        success: true,
        source: "github",
        path: cleanPath,
        content,
      });
    }
  } catch (error) {
    console.error("Failed to fetch raw file from GitHub, attempting local fallback:", error);
  }

  // Local filesystem fallback
  try {
    const localFilePath = path.join(process.cwd(), cleanPath);
    if (fs.existsSync(localFilePath)) {
      const content = fs.readFileSync(localFilePath, "utf8");
      return NextResponse.json({
        success: true,
        source: "local_fallback",
        path: cleanPath,
        content,
      });
    }
  } catch (err) {
    console.error("Local file read failed:", err);
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
