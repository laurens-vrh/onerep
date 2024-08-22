import { prisma } from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SearchResults } from "./SearchResults";
import { auth } from "@/auth";

export async function GET(
	request: NextRequest
): Promise<NextResponse<SearchResults>> {
	const searchTerm = request.nextUrl.searchParams.get("term")?.toLowerCase();
	if (!searchTerm) return new NextResponse("Bad Request", { status: 400 });

	const session = await auth();
	if (!session) return new NextResponse("Bad Request", { status: 400 });

	const limit = request.nextUrl.searchParams.get("full") === "true" ? 50 : 5;

	const [compositions, composers, lists, users] = await Promise.all([
		prisma.$queryRaw`
			SELECT c.id, c.name, json_agg(jsonb_build_object('id', a.id, 'name', a.name)) AS composers
			FROM "Composition" c
			JOIN "_ComposerToComposition" ac ON c.id = ac."B"
			JOIN "Composer" a ON ac."A" = a.id
			WHERE (c.approved = true OR c."submittorId" = ${session.user.id}) AND SIMILARITY(c.name, ${searchTerm}) + SIMILARITY(a.name, ${searchTerm}) > 0.3
			GROUP BY c.id
			ORDER BY SIMILARITY(c.name, ${searchTerm}) DESC
			LIMIT ${limit};
		`,
		prisma.$queryRaw`
			SELECT a.id, a.name, jsonb_build_object('compositions',(SELECT COUNT(*)::integer FROM "_ComposerToComposition" ac WHERE ac."A" = a.id),'savedBy',(SELECT COUNT(*)::integer FROM "_ComposerToUser" ac WHERE ac."A" = a.id)) AS "_count"
			FROM "Composer" a
			WHERE (a.approved = true OR a."submittorId" = ${session.user.id}) AND a.name % ${searchTerm}
			ORDER BY SIMILARITY(a.name, ${searchTerm}) DESC
			LIMIT ${limit};
		`,
		prisma.$queryRaw`
			SELECT l.name, l.id, l.icon, jsonb_build_object('username', u.username, 'id', u.id) AS "user", jsonb_build_object('compositions', (SELECT COUNT(*)::integer FROM "ListComposition" lc WHERE lc."listId" = l.id)) AS "_count"
			FROM "List" l
			JOIN "User" u ON l."userId" = u.id
			WHERE l.custom = true AND l.name % ${searchTerm}
			ORDER BY SIMILARITY(l.name, ${searchTerm}) DESC
			LIMIT ${limit};
		`,
		prisma.$queryRaw`
			SELECT u.username, u.id
			FROM "User" u
			WHERE u.username % ${searchTerm}
			ORDER BY SIMILARITY(u.username, ${searchTerm}) DESC
			LIMIT ${limit};
		`,
	]);

	return NextResponse.json({
		compositions,
		composers,
		lists,
		users,
	}) as NextResponse<SearchResults>;
}
