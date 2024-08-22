"use server";

import { Composer, Prisma, Role, UpdateType } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/database/prisma";
import { createUpdate } from "@/database/Update";
import { ComposerFormData, composerFormSchema } from "@/lib/schemas";
import {
	AddComposerFormResponse,
	ApproveComposerResponse,
	ToastResponse,
} from "@/lib/types/responses";

export async function addComposer(
	data: ComposerFormData
): Promise<AddComposerFormResponse> {
	if (composerFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await auth();
	if (!session) return { success: false };

	try {
		const composer = await prisma.composer.create({
			data: {
				name: data.name,
				submittorId: session.user.id,
			},
			select: { id: true, name: true },
		});

		return { success: true, composer };
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
	}

	return { success: false };
}

export async function updateComposer(id: number, data: Pick<Composer, "name">) {
	if (composerFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await auth();
	if (!session || session.user.role !== Role.ADMIN) return { success: false };

	try {
		await prisma.composer.update({
			where: { id },
			data,
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function approveComposer(
	id: number,
	approved: boolean | null
): Promise<ApproveComposerResponse> {
	const session = await auth();
	if (session?.user.role !== Role.ADMIN)
		return { success: false, error: "Unauthorized" };

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
	const session = await auth();
	if (session?.user.role !== Role.ADMIN)
		return { success: false, error: "Unauthorized" };

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
	const session = await auth();
	if (session?.user.role !== Role.ADMIN)
		return { success: false, error: "Unauthorized" };

	try {
		await prisma.composer.delete({ where: { id } });
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function generalSave({
	type,
	id,
	save,
}: { save: boolean } & (
	| {
			type: "list" | "composer";
			id: number;
	  }
	| { type: "user"; id: string }
)) {
	const session = await auth();
	if (!session) return { success: false };

	try {
		await prisma.user.update({
			where: { id: session.user.id },
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
				type === "user"
					? { type: UpdateType.FOLLOW, relatedUserId: id }
					: type === "composer"
					? { type: UpdateType.SAVE_COMPOSER, relatedComposerId: id }
					: {
							type: UpdateType.SAVE_LIST,
							relatedListId: id,
					  }
			);
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}
