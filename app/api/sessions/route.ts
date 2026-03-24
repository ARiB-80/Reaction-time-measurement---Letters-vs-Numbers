import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "sessions.xlsx");

interface SessionRow {
  Session: number;
  Date: string;
  Time: string;
  Score: number;
  "Avg RT (ms)": number;
  "Min RT (ms)": number;
  "Max RT (ms)": number;
}

function readSessions(): SessionRow[] {
  if (!fs.existsSync(FILE_PATH)) return [];
  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<SessionRow>(sheet);
}

function writeSessions(rows: SessionRow[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sessions");
  XLSX.writeFile(workbook, FILE_PATH);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("download") === "true") {
    if (!fs.existsSync(FILE_PATH)) {
      return new NextResponse("No data yet", { status: 404 });
    }
    const buffer = fs.readFileSync(FILE_PATH);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="reaction_times.xlsx"',
      },
    });
  }

  return NextResponse.json(readSessions());
}

export async function POST(request: NextRequest) {
  const { score, avgRT, minRT, maxRT } = await request.json();

  const rows = readSessions();
  rows.push({
    Session: rows.length + 1,
    Date: new Date().toLocaleDateString(),
    Time: new Date().toLocaleTimeString(),
    Score: score,
    "Avg RT (ms)": avgRT,
    "Min RT (ms)": minRT,
    "Max RT (ms)": maxRT,
  });

  writeSessions(rows);
  return NextResponse.json({ success: true });
}
