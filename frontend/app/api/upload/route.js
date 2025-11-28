import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request) {
  const body = await request.json();
  
  if (!body || Object.keys(body).length === 0)
    return NextResponse.json({ success: false, message: "Environment not found!" });

  if (!body.name)
    return NextResponse.json({ success: false, message: "Name not found!" });

  const filePath = path.join(process.cwd(), "../config/environments.json");
  const content = fs.readFileSync(filePath, "utf-8");
  
  let data;
  try {
    data = content ? JSON.parse(content) : [];
    if (!Array.isArray(data)) {
    }
  } catch {
    data = [];
  }

  data.push(body);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({
    success: true,
    message: "Environment uploaded Successfully.",
  });
}
