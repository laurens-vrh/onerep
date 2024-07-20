"use server";

import { List, Prisma } from "@prisma/client";
import { getCurrentUser } from "../database/User";
import { prisma } from "../database/prisma";
import { listFormSchema } from "../schemas";
import { createUpdate } from "../database/Update";

export async function createList(data: {
	userId: number;
	name: string;
	icon: number;
	description?: string;
}) {
	if (listFormSchema.safeParse(data).success === false)
		return { success: false };
	const user = await getCurrentUser();
	if (!user) return { success: false };

	try {
		var list = await prisma.list.create({ data });
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
	const user = await getCurrentUser();
	if (!user) return { success: false };

	try {
		await prisma.list.update({
			where: { id, userId: user.id },
			data: data,
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}
