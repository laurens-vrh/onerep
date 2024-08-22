import { prisma } from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchTerm = request.nextUrl.searchParams.get("term");
	if (!searchTerm) return new NextResponse("Bad Request", { status: 400 });

	const composers = await prisma.$queryRaw`
			SELECT a.*
			FROM "Composer" a
			WHERE (a.approved = true or a.approved is null) AND a.name % ${searchTerm}
			ORDER BY SIMILARITY(a.name, ${searchTerm}) DESC
			LIMIT 10;
		`;

	return NextResponse.json(composers);
}
