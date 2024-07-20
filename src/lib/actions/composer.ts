"use server";

import { Prisma, Role, UpdateType } from "@prisma/client";
import { getCurrentUser } from "../database/User";
import { getSession } from "../database/Session";
import {
	AddComposerFormResponse,
	ApproveComposerResponse,
	ToastResponse,
} from "../types/responses";
import { prisma } from "../database/prisma";
import { addComposerFormSchema, AddComposerFormSchemaData } from "../schemas";
import { createUpdate } from "../database/Update";

export async function addComposer(
	data: AddComposerFormSchemaData
): Promise<AddComposerFormResponse> {
	if (addComposerFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await getSession();
	if (!session) return { success: false };

	try {
		const composer = await prisma.composer.create({
			data: {
				name: data.name,
				submittorId: session.userId,
			},
		});

		return { success: true, id: composer.id };
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
	}

	return { success: false };
}

export async function approveComposer(
	id: number,
	approved: boolean | null
): Promise<ApproveComposerResponse> {
	const user = await getCurrentUser();
	if (user?.role !== Role.ADMIN)
		return { success: false, error: "Uncomposerized" };

	try {
		await prisma.composer.update({ where: { id }, data: { approved } });
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function approveComposers(
	ids: number[],
	approved: boolean | null
): Promise<ApproveComposerResponse> {
	const user = await getCurrentUser();
	if (user?.role !== Role.ADMIN)
		return { success: false, error: "Uncomposerized" };

	try {
		await prisma.composer.updateMany({
			where: { id: { in: ids } },
			data: { approved },
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function deleteComposer(id: number): Promise<ToastResponse> {
	const user = await getCurrentUser();
	if (user?.role !== Role.ADMIN)
		return { success: false, error: "Uncomposerized" };

	try {
		await prisma.composer.delete({ where: { id } });
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function generalSave(
	type: "list" | "composer" | "user",
	id: number,
	save: boolean
) {
	const user = await getCurrentUser();
	if (!user) return { success: false };

	try {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				[type === "list"
					? "savedLists"
					: type === "composer"
					? "savedComposers"
					: "following"]: save ? { connect: { id } } : { disconnect: { id } },
			},
		});
		if (save)
			createUpdate(
				type === "list"
					? {
							type: UpdateType.SAVE_LIST,
							relatedListId: id,
					  }
					: type === "composer"
					? { type: UpdateType.SAVE_COMPOSER, relatedComposerId: id }
					: { type: UpdateType.FOLLOW, relatedUserId: id }
			);
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}
