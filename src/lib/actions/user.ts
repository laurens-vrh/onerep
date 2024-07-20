"use server";

import { Prisma } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../database/prisma";
import {
	UserSignUpFormSchemaData,
	userSignUpFormSchema,
	UserSignInFormSchemaData,
	userSignInFormSchema,
} from "../schemas";
import {
	UserSignUpFormResponse,
	UserSignInFormResponse,
} from "../types/responses";
import { getCurrentUser } from "../database/User";
import { storageBucket } from "../firebase";

export async function signUp(
	credentials: UserSignUpFormSchemaData
): Promise<UserSignUpFormResponse> {
	if (userSignUpFormSchema.safeParse(credentials).success === false)
		return { success: false };

	try {
		const user = await prisma.user.create({
			data: {
				email: credentials.email,
				username: credentials.username.toLowerCase(),
				password: await hash(credentials.password, 10),
			},
		});
		await prisma.list.createMany({
			data: [
				{
					name: "Repertoire",
					userId: user.id,
					icon: 0,
					custom: false,
					description: "Compositions you can currently play",
					position: 1,
				},
				{
					name: "Want to play",
					userId: user.id,
					icon: 1,
					custom: false,
					position: 2,
				},
				{
					name: "Archive",
					userId: user.id,
					icon: 2,
					custom: false,
					position: 3,
				},
				{
					name: "Favorites",
					userId: user.id,
					icon: 3,
					custom: false,
					position: 4,
				},
			],
		});

		return { success: true };
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		if (error.code === "P2002")
			return { success: false, error: "ALREADY_USED" };
	}

	return { success: false };
}

export async function signIn(
	credentials: UserSignInFormSchemaData,
	redirectTo?: string
): Promise<UserSignInFormResponse> {
	if (userSignInFormSchema.safeParse(credentials).success === false)
		return { success: false, error: "INVALID" };

	const user = await prisma.user.findUnique({
		where: {
			email: credentials.email,
		},
	});

	if (!user) return { success: false, error: "INVALID_EMAIL" };
	if (!(await compare(credentials.password, user.password)))
		return { success: false, error: "INVALID_PASSWORD" };

	const session = await prisma.session.create({
		data: {
			userId: user.id,
		},
	});

	cookies().set({
		name: "onerep:session",
		value: session.id,
	});
	redirect(redirectTo ?? "/app");
}

export async function signOut() {
	await prisma.session.delete({
		where: { id: cookies().get("onerep:session")?.value },
	});
	cookies().delete({
		name: "onerep:session",
	});
	redirect("/");
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

	cookies().delete({
		name: "onerep:session",
	});
	redirect("/");
}
