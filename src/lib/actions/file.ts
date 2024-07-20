"use server";

import { Prisma } from "@prisma/client";
import { getCurrentUser } from "../database/User";
import { storageBucket } from "../firebase";
import { prisma } from "../database/prisma";

export async function deleteFile(id: number) {
	const user = await getCurrentUser();
	if (!user) return { success: false, error: "Uncomposerized" };

	try {
		const file = await prisma.file.delete({
			where: {
				id,
			},
		});
		await storageBucket.file(user.id + "/" + file.name).delete();
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}
