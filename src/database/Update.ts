import { Composer, Update as DatabaseUpdate, List, User } from "@prisma/client";
import {
	CompositionWithComposers,
	getCurrentUser,
	getUserProfile,
} from "./User";
import { cache } from "react";
import { prisma } from "./prisma";
import { auth } from "../auth";

export type Update = Pick<DatabaseUpdate, "createdAt" | "type"> & {
	user: Pick<User, "id" | "username">;
	relatedComposition: CompositionWithComposers | null;
	relatedList:
		| (Pick<List, "id" | "name" | "icon"> & {
				_count: { compositions: number };
				user: Pick<User, "id" | "username">;
		  })
		| null;
	relatedUser: Pick<User, "id" | "username"> | null;
	relatedComposer: Pick<Composer, "id" | "name"> | null;
};

export const getUpdates = cache(async (): Promise<Update[] | null> => {
	const session = await auth();
	if (!session) return null;
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { following: { select: { id: true } } },
	});
	if (!user) return null;

	return await prisma.update.findMany({
		where: { userId: { in: user.following.map((u) => u.id) } },
		select: {
			createdAt: true,
			type: true,
			user: {
				select: {
					id: true,
					username: true,
				},
			},
			relatedComposition: {
				select: {
					id: true,
					name: true,
					composers: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			relatedList: {
				select: {
					id: true,
					name: true,
					icon: true,
					_count: {
						select: { compositions: true },
					},
					user: {
						select: {
							id: true,
							username: true,
						},
					},
				},
			},
			relatedComposer: {
				select: {
					id: true,
					name: true,
				},
			},
			relatedUser: {
				select: {
					id: true,
					username: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
		take: 30,
	});
});

export const createUpdate = async (
	update: Partial<
		Pick<
			DatabaseUpdate,
			| "relatedComposerId"
			| "relatedCompositionId"
			| "relatedListId"
			| "relatedUserId"
		>
	> &
		Pick<DatabaseUpdate, "type">
) => {
	const user = await getCurrentUser();
	if (!user) return;

	const updates = await prisma.update.findMany({
		where: { userId: user.id },
		select: { id: true },
		orderBy: { createdAt: "asc" },
	});

	if (updates.length >= 10)
		prisma.update.deleteMany({
			where: {
				id: { in: updates.slice(0, updates.length - 9).map((u) => u.id) },
			},
		});
	await prisma.update.create({ data: { userId: user.id, ...update } });
};

export const getHomeData = cache(async () => {
	const user = await getCurrentUser();
	if (!user) return null;

	const [compositions, lists, composers] = await Promise.all([
		prisma.composition
			.findMany({
				where: { approved: true },
				select: {
					id: true,
					name: true,
					composers: {
						select: { id: true, name: true },
					},
					_count: {
						select: {
							users: true,
						},
					},
				},
				orderBy: { users: { _count: "desc" } },
				take: 10,
			})
			.then((compositions) => compositions.filter((c) => c._count.users > 5)),
		prisma.list
			.findMany({
				select: {
					id: true,
					name: true,
					icon: true,
					user: {
						select: { id: true, username: true },
					},
					_count: {
						select: {
							compositions: true,
							savedBy: true,
						},
					},
				},
				orderBy: { savedBy: { _count: "desc" } },
				take: 10,
			})
			.then((compositions) => compositions.filter((c) => c._count.savedBy > 5)),
		prisma.composer
			.findMany({
				where: { approved: true },
				select: {
					id: true,
					name: true,
					_count: {
						select: {
							compositions: true,
							savedBy: true,
						},
					},
				},
				orderBy: { savedBy: { _count: "desc" } },
				take: 10,
			})
			.then((compositions) => compositions.filter((c) => c._count.savedBy > 5)),
	]);

	return { compositions, lists, composers };
});
