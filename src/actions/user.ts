"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/database/prisma";
import { getCurrentUser } from "@/database/User";
import { storageBucket } from "@/firebase";
import { SignUpData, signUpSchema } from "@/lib/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcryptjs";

export async function signUp(credentials: SignUpData) {
	if (signUpSchema.safeParse(credentials).success === false)
		return { success: false };

	try {
		await prisma.user.create({
			data: {
				email: credentials.email.toLowerCase(),
				username: credentials.username,
				password: await hash(credentials.password, 10),
			},
		});

		return { success: true };
	} catch (error) {
		if (!(error instanceof PrismaClientKnownRequestError)) throw error;
		if (error.code === "P2002") return { success: false, error: "IN_USE" };
	}

	return { success: false };
}

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
