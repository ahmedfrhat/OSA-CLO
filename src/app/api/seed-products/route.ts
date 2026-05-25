import { NextResponse } from "next/server";

/**
 * SEEDING DISABLED
 *
 * The database was successfully seeded with 500 streetwear products on 2026-05-25.
 * Both POST and GET handlers are intentionally locked down with a 403 response
 * to prevent accidental or malicious re-seeding in production.
 *
 * If a re-seed is ever needed, restore the previous version from git history
 * (commit 0f44273^) and run it from a controlled environment.
 */

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Seeding is disabled. Database was already seeded successfully.",
    },
    { status: 403 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Seeding is disabled. Database was already seeded successfully.",
    },
    { status: 403 }
  );
}
