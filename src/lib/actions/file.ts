"use server";

import { Prisma } from "@prisma/client";
import { auth } from "../auth";
import { prisma } from "../database/prisma";
import { storageBucket } from "../firebase";

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
