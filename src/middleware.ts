import { Role } from "@prisma/client";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const cookie = request.cookies
		.getAll()
		.find((c) => c.name.endsWith("authjs.session-token"));
	const session = !cookie
		? null
		: await decode({
				token: cookie?.value,
				salt: cookie.name,
				secret: process.env.AUTH_SECRET,
		  }).catch(() => null);

	if (path === "/") {
		if (session && request.nextUrl.searchParams.get("landing") !== "true")
			return NextResponse.redirect(
				process.env.NEXT_PUBLIC_BASE_URL + "/auth/signin"
			);
		else return NextResponse.next();
	}

	function noSession() {
		if (request.nextUrl.pathname.startsWith("/app"))
			return NextResponse.redirect(
				process.env.NEXT_PUBLIC_BASE_URL +
					"/auth/signin?redirectTo=" +
					request.nextUrl.pathname +
					request.nextUrl.search
			);
		else if (request.nextUrl.pathname === "/auth/signin") {
			return NextResponse.next();
		} else return NextResponse.next();
	}

	if (!session) return noSession();
	if (
		request.nextUrl.pathname.startsWith("/app/admin") &&
		session.role !== Role.ADMIN
	)
		return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + "/app");

	if (request.nextUrl.pathname === "/auth/signin")
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
