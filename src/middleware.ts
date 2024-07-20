import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const sessionId = request.cookies.get("onerep:session")?.value;

	if (path === "/") {
		if (sessionId && request.nextUrl.searchParams.get("landing") !== "true")
			return NextResponse.redirect(
				process.env.NEXT_PUBLIC_BASE_URL + "/auth/signin"
			);
		else return NextResponse.next();
	}

	function noSession(invalid: boolean) {
		if (invalid) request.cookies.delete("onerep:session");

		if (request.nextUrl.pathname.startsWith("/app"))
			return NextResponse.redirect(
				process.env.NEXT_PUBLIC_BASE_URL +
					"/auth/signin?redirectTo=" +
					request.nextUrl.pathname +
					request.nextUrl.search
			);
		else if (request.nextUrl.pathname.startsWith("/auth/")) {
			return NextResponse.next();
		} else return NextResponse.next();
	}

	if (!sessionId) return noSession(false);

	const sessionResponse = await fetch(
		process.env.NEXT_PUBLIC_API_BASE + "/session",
		{
			headers: { Cookie: `onerep:session=${sessionId}` },
		}
	);
	const session = await sessionResponse.json().catch(() => {});
	if (!session) return noSession(true);

	if (
		request.nextUrl.pathname.startsWith("/app/admin") &&
		session.user.role !== Role.ADMIN
	)
		return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + "/app");

	if (request.nextUrl.pathname.startsWith("/auth/"))
		return NextResponse.redirect(
			process.env.NEXT_PUBLIC_BASE_URL +
				(request.nextUrl.searchParams.get("redirectTo") ?? "/app")
		);

	return NextResponse.next();
}

export const config = {
	matcher: [
		{
			source: "/((?!api|_next/static|_next/image|favicon.*).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
