"use server";

import { List, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { createUpdate } from "@/database/Update";
import { prisma } from "@/database/prisma";
import { listFormSchema } from "@/lib/schemas";

export async function createList(data: {
	name: string;
	icon: number;
	description?: string;
}) {
	if (listFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await auth();
	if (!session) return { success: false };

	try {
		var list = await prisma.list.create({
			data: { ...data, userId: session.user.id },
		});
		createUpdate({ type: "CREATE_LIST", relatedListId: list.id });
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true, listId: list.id };
}

export async function updateList(
	id: number,
	data: Pick<List, "name" | "description" | "icon">
) {
	if (listFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await auth();
	if (!session) return { success: false };

	try {
		await prisma.list.update({
			where: { id, userId: session.user.id },
			data: data,
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function deleteList(
	id: number
): Promise<{ success: true } | { success: false; error?: string }> {
	const session = await auth();
	if (!session) return { success: false };

	await prisma
		.$transaction([
			prisma.list.delete({ where: { userId: session.user.id, id } }),
			prisma.userCompositionData.deleteMany({
				where: {
					userId: session.user.id,
					composition: {
						lists: { none: { list: { userId: session.user.id } } },
					},
				},
			}),
		])
		.catch((error) => {
			if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
			return { success: false, error: error.code + " " + error.name };
		});

	return { success: true };
}
