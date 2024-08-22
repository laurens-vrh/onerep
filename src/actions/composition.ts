"use server";

import { auth } from "@/auth";
import { getList } from "@/database/List";
import { prisma } from "@/database/prisma";
import { createUpdate } from "@/database/Update";
import { getUserProfile } from "@/database/User";
import { storageBucket } from "@/firebase";
import { CompositionFormData, compositionFormSchema } from "@/lib/schemas";
import {
	ApproveCompositionResponse,
	CompositionFormResponse,
	ToastResponse,
} from "@/lib/types/responses";
import {
	Composer,
	Composition,
	ListComposition,
	Prisma,
	Role,
	UpdateType,
	UserCompositionData,
} from "@prisma/client";

export async function addComposition(
	data: CompositionFormData
): Promise<CompositionFormResponse> {
	if (compositionFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await auth();
	if (!session) return { success: false };

	if (data.composers.length === 0)
		return {
			success: false,
			error: ["composers", { message: "Composer unknown" }],
		};

	try {
		const composition = await prisma.composition.create({
			data: {
				name: data.name,
				submittorId: session.user.id,
				composers: {
					connect: data.composers.map((id) => ({
						id,
					})),
				},
			},
			select: { id: true, name: true },
		});

		return { success: true, composition };
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		if (error.code === "P2025")
			return {
				success: false,
				error: ["composers", { message: "Composer unknown" }],
			};
	}

	return { success: false };
}

export async function updateComposition(
	id: number,
	data: Pick<Composition, "name"> & { composers: number[] }
) {
	if (compositionFormSchema.safeParse(data).success === false)
		return { success: false };
	const session = await auth();
	if (!session || session.user.role !== Role.ADMIN) return { success: false };

	try {
		await prisma.composition.update({
			where: { id },
			data: {
				...data,
				composers: {
					connect: data.composers.map((id) => ({ id })),
				},
			},
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		if (error.code === "P2025")
			return {
				success: false,
				error: ["composers", { message: "Composer unknown" }] as const,
			};
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function approveComposition(
	id: number,
	approved: boolean | null
): Promise<ApproveCompositionResponse> {
	const session = await auth();
	if (session?.user.role !== Role.ADMIN)
		return { success: false, error: "Unauthorized" };

	try {
		await prisma.composition.update({ where: { id }, data: { approved } });
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function approveCompositions(
	ids: number[],
	approved: boolean | null
): Promise<ApproveCompositionResponse> {
	const session = await auth();
	if (session?.user.role !== Role.ADMIN)
		return { success: false, error: "Unauthorized" };

	try {
		await prisma.composition.updateMany({
			where: { id: { in: ids } },
			data: { approved },
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function saveComposition(
	id: number,
	listId: number,
	save: boolean
): Promise<
	| { success: false; error?: string }
	| {
			success: true;
			listComposition?: ListComposition & {
				composition: Composition & { composers: Composer[] };
			};
	  }
> {
	const session = await auth();
	if (!session) return { success: false };

	try {
		const list = await prisma.list.findUnique({
			where: { id: listId },
			select: {
				position: true,
				_count: {
					select: {
						compositions: true,
					},
				},
			},
		});
		if (!list) return { success: false };
		const listLength = list._count.compositions ?? -1;

		var listComposition:
			| (ListComposition & {
					composition: Composition & { composers: Composer[] };
			  })
			| undefined;

		if (save) {
			listComposition = await prisma.listComposition.create({
				data: {
					compositionId: id,
					listId,
					position: listLength + 1,
				},
				include: {
					composition: { include: { composers: true } },
				},
			});

			if (list.position === 1 || list.position === 4)
				createUpdate({
					type:
						list.position === 1 ? UpdateType.REPERTOIRE : UpdateType.FAVORITE,
					relatedCompositionId: id,
					relatedListId: listId,
				});
		} else {
			const oldPosition = (
				await prisma.listComposition.findUnique({
					where: { listId_compositionId: { listId, compositionId: id } },
					select: { position: true },
				})
			)?.position;
			if (oldPosition)
				await prisma.$queryRaw`update "ListComposition" set position = position - 1 where "listId" = ${listId} and position <= ${listLength} and position > ${oldPosition}`;

			await prisma.listComposition.delete({
				where: { listId_compositionId: { listId, compositionId: id } },
			});
		}

		if (save)
			await prisma.userCompositionData.upsert({
				create: {
					userId: session.user.id,
					compositionId: id,
				},
				update: {
					updatedAt: new Date(),
				},
				where: {
					userId_compositionId: {
						userId: session.user.id,
						compositionId: id,
					},
				},
			});
		else if (
			!(await getUserProfile(session.user.id))?.lists
				.reduce(
					(accumulator, currentValue) => [
						...accumulator,
						...currentValue.compositions.map((c) => c.composition.id),
					],
					[] as number[]
				)
				.includes(id)
		) {
			const files = await prisma.file.findMany({
				where: {
					userId: session.user.id,
					compositionId: id,
				},
			});
			await Promise.all(
				files.map((file) =>
					storageBucket.file(session.user.id + "/" + file.name).delete()
				)
			);
			await prisma.file.deleteMany({
				where: { userId: session.user.id, compositionId: id },
			});

			await prisma.userCompositionData.delete({
				where: {
					userId_compositionId: { userId: session.user.id, compositionId: id },
				},
			});
		}
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true, ...(listComposition ? { listComposition } : {}) };
}

export async function deleteComposition(id: number): Promise<ToastResponse> {
	const session = await auth();
	if (session?.user.role !== Role.ADMIN)
		return { success: false, error: "Unauthorized" };

	try {
		await prisma.composition.delete({ where: { id } });
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function updateUserCompositionData(
	id: number,
	data: Partial<UserCompositionData>
) {
	const session = await auth();
	if (!session) return { success: false };

	try {
		await prisma.userCompositionData.update({
			where: {
				userId_compositionId: { userId: session.user.id, compositionId: id },
			},
			data: data,
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true };
}

export async function updatePosition(
	compositionId: number,
	listId: number,
	oldPosition: number,
	offset: number
) {
	const session = await auth();
	if (!session) return { success: false };
	if (offset !== 1 && offset !== -1) return { success: false };

	const newPosition = oldPosition + offset;
	if (newPosition < 1) return { success: false };
	const up = oldPosition > newPosition;

	try {
		const list = await prisma.list.findUnique({
			where: {
				userId: session.user.id,
				id: listId,
				compositions: { some: { compositionId } },
			},
		});
		if (!list) return { success: false };

		if (up)
			await prisma.$queryRaw`update "ListComposition" set position = position + 1 where "listId" = ${listId} and position >= ${newPosition} and position < ${oldPosition}`;
		else
			await prisma.$queryRaw`update "ListComposition" set position = position - 1 where "listId" = ${listId} and position <= ${newPosition} and position > ${oldPosition}`;

		await prisma.listComposition.update({
			where: { listId_compositionId: { listId, compositionId } },
			data: { position: newPosition },
		});
	} catch (error) {
		if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
		return { success: false, error: error.code + " " + error.name };
	}

	return { success: true, list: await getList(listId) };
}
