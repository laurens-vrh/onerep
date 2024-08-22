import { cache } from "react";
import { prisma } from "./prisma";
import {
	Composer,
	Composition,
	List,
	ListComposition,
	User,
	UserCompositionData,
} from "@prisma/client";
import { auth } from "../auth";

export type ListProfile = Pick<
	List,
	"id" | "name" | "icon" | "description" | "custom" | "createdAt" | "updatedAt"
> & {
	user: Pick<User, "id" | "username"> & {
		lists: (Pick<List, "id" | "name" | "icon"> & {
			compositions: Pick<ListComposition, "compositionId">[];
			_count: {
				compositions: number;
			};
		})[];
	};
	_count: {
		savedBy: number;
	};

	compositions: (Pick<ListComposition, "position" | "listId" | "createdAt"> & {
		composition: Pick<Composition, "id" | "name"> & {
			composers: Pick<Composer, "id" | "name">[];
			users: Pick<UserCompositionData, "createdAt" | "endDate" | "updatedAt">[];
		};
	})[];

	otherCompositions: (Pick<Composition, "id" | "name"> & {
		composers: Pick<Composer, "id" | "name">[];
	})[];
};

export const getList = cache(
	async (id: number): Promise<ListProfile | null> => {
		const session = await auth();
		if (!session) return null;

		const list = await prisma.list.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				icon: true,
				description: true,
				custom: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						savedBy: true,
					},
				},
				user: {
					select: {
						id: true,
						username: true,
						lists: {
							select: {
								id: true,
								name: true,
								icon: true,
								_count: { select: { compositions: true } },
								compositions: { select: { compositionId: true } },
							},
						},
					},
				},
				compositions: {
					select: {
						position: true,
						listId: true,
						createdAt: true,
						composition: {
							select: {
								id: true,
								name: true,
								composers: {
									select: { id: true, name: true },
								},
								users: {
									select: {
										endDate: true,
										createdAt: true,
										updatedAt: true,
									},
									where: {
										userId: (
											await prisma.list.findUnique({
												select: { userId: true },
												where: { id },
											})
										)?.userId,
									},
								},
							},
						},
					},
				},
			},
		});
		if (!list) return null;

		const otherCompositions = await prisma.composition.findMany({
			where: {
				id: {
					notIn: list.compositions.map((c) => c.composition.id),
				},
				composers: {
					some: {
						id: {
							in: list.compositions
								.map((c) => c.composition.composers.map((c) => c.id))
								.flat(),
						},
					},
				},
			},
			select: {
				id: true,
				name: true,
				composers: { select: { id: true, name: true } },
			},
			orderBy: {
				users: {
					_count: "desc",
				},
			},
			take: 10,
		});

		return { ...list, otherCompositions };
	}
);
