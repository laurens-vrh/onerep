"use server";

import { FileType } from "@prisma/client";
import { getDownloadURL } from "firebase-admin/storage";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/database/User";
import { storageBucket } from "@/lib/firebase";
import { prisma } from "@/lib/database/prisma";
import { matchesWildcard } from "@/lib/utils";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const compositionId = parseInt(searchParams.get("compositionId") ?? "");
	const name = searchParams.get("name");
	const type = searchParams.get("type");
	const file = await request.blob();
	const size = file.size;

	if (!compositionId || !name || !type || !size)
		return new NextResponse("Bad Request", { status: 400 });
	if (type !== "application/pdf" && !matchesWildcard(type, "audio/*"))
		return NextResponse.json({
			success: false,
			error: "Unsupported file type",
		});
	if (size > 4500000)
		return NextResponse.json({
			success: false,
			error: "File size cannot exceed 4.5 MB.",
		});

	const sessionId = cookies().get("onerep:session")?.value;
	const userId = sessionId
		? (await prisma.session.findUnique({ where: { id: sessionId } }))?.userId ??
		  0
		: 0;
	if (userId === 0) return new NextResponse("Bad Request", { status: 400 });

	const userProfile = await getUserProfile(userId);
	if (
		!userProfile?.compositions.find((c) => c.composition.id === compositionId)
	)
		return NextResponse.json({
			success: false,
			error: "Composition not saved.",
		});

	const typeEnum =
		type === "application/pdf" ? FileType.SHEETMUSIC : FileType.PERFORMANCE;
	const fileEntry = await prisma.file.findFirst({
		where: {
			userId: userId,
			compositionId,
			type: typeEnum,
		},
	});

	if (fileEntry)
		return NextResponse.json({
			success: false,
			error: "File already exists.",
		});

	try {
		const fileRef = storageBucket.file(userId + "/" + name);
		await fileRef.save(new Uint8Array(await file.arrayBuffer()));
		const url = await getDownloadURL(fileRef);

		const databaseFile = await prisma.file
			.create({
				data: {
					type: typeEnum,
					name,
					url,
					size,
					userId,
					compositionId,
				},
			})
			.catch(async (e) => {
				await fileRef.delete();
				return e.code as string;
			});
		if (typeof databaseFile === "string")
			return NextResponse.json({
				success: false,
				error: databaseFile,
			});

		return NextResponse.json({ success: true, file: databaseFile });
	} catch (e: any) {
		throw e;
		return NextResponse.json({
			success: false,
			error: e.code,
		});
	}
}
