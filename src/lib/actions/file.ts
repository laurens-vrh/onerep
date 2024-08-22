"use server";

import { FileType, Prisma } from "@prisma/client";
import { getDownloadURL } from "firebase-admin/storage";
import { auth } from "../auth";
import { prisma } from "../database/prisma";
import { getUserProfile } from "../database/User";
import { storageBucket } from "../firebase";

export async function uploadFile({
	compositionId,
	name,
	type,
}: {
	compositionId: number;
	name: string;
	type: string;
}) {
	if (!compositionId || !name || !type) return null;
	if (type !== "application/pdf" && !type.startsWith("audio/")) return null;

	const session = await auth();
	if (!session) return null;

	const userProfile = await getUserProfile(session.user.id as string);
	if (
		!userProfile?.compositions.find((c) => c.composition.id === compositionId)
	)
		return {
			success: false,
			error: "Composition not saved",
		};

	const typeEnum =
		type === "application/pdf" ? FileType.SHEETMUSIC : FileType.PERFORMANCE;
	const fileEntry = await prisma.file.findFirst({
		where: {
			userId: session.user.id,
			compositionId,
			type: typeEnum,
		},
	});
	if (fileEntry)
		return {
			success: false,
			error: "File already exists",
		};

	const fileRef = storageBucket.file(session.user.id + "/" + name);

	const [uploadUrl] = await fileRef.getSignedUrl({
		action: "write",
		expires: Date.now() + 15 * 60 * 1000,
		contentType: type,
		extensionHeaders: {
			"x-goog-content-length-range": "0," + 5 * 2 ** 20,
		},
	});

	return {
		success: true,
		url: uploadUrl,
	};
}

export async function getFile({
	compositionId,
	name,
	type,
}: {
	compositionId: number;
	name: string;
	type: FileType;
}) {
	const session = await auth();
	if (!session) return null;

	const fileRef = storageBucket.file(session.user.id + "/" + name);
	const [url, [{ size }]] = await Promise.all([
		getDownloadURL(fileRef),
		await fileRef.getMetadata(),
	]);

	const databaseFile = await prisma.file
		.create({
			data: {
				type,
				name,
				url,
				size: typeof size === "number" ? size : 0,
				userId: session.user.id,
				compositionId,
			},
			select: {
				id: true,
				name: true,
				url: true,
			},
		})
		.catch(async (e) => {
			return e.code as string;
		});

	if (typeof databaseFile === "string")
		return {
			success: false,
			error: databaseFile,
		};
	return { success: true, file: databaseFile };
}

export async function deleteFile(id: number) {
	const session = await auth();
	if (!session) return { success: false };

	try {
		const file = await prisma.file.delete({
			where: {
				id,
			},
		});
		await storageBucket.file(session.user.id + "/" + file.name).delete();
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}
