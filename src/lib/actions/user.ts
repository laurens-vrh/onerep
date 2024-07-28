"use server";

import { redirect } from "next/navigation";
import { prisma } from "../database/prisma";
import { getCurrentUser } from "../database/User";
import { storageBucket } from "../firebase";

export async function deleteAccount() {
	const user = await getCurrentUser();
	if (!user) return;

	const files = await prisma.file.findMany({
		where: {
			userId: user.id,
		},
	});
	await Promise.all(
		files.map((file) => storageBucket.file(user.id + "/" + file.name).delete())
	);
	await prisma.$transaction([
		prisma.file.deleteMany({
			where: { userId: user.id },
		}),
		prisma.user.delete({
			where: { id: user.id },
		}),
	]);

	redirect("/");
}
