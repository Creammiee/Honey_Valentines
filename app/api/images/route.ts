import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDirectory = path.join(process.cwd(), "public/images");

    const files = fs.readdirSync(imagesDirectory);

    // Filter only image files
    const images = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Cannot read images folder" });
  }
}