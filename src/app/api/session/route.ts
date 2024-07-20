import { prisma } from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const id = request.cookies.get("onerep:session")?.value;
	if (!id) return NextResponse.json(null);

	return NextResponse.json(
		await prisma.session.findUnique({
			where: { id },
			select: { user: { select: { role: true } } },
		})
	);
}
