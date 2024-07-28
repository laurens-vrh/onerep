import { cache } from "react";
import { prisma } from "./prisma";
import { getCurrentUser } from "./User";
import {
	Composer,
	Composition,
	UserCompositionData,
	File,
} from "@prisma/client";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { auth } from "../auth";

export type CompositionProfile = Pick<
	Composition,
	"id" | "name" | "approved"
> & {
	_count: {
		users: number;
	};
	composers: Pick<Composer, "id" | "name">[];
	users: (Pick<
		UserCompositionData,
		"createdAt" | "updatedAt" | "startDate" | "endDate" | "notes"
	> & {
		files: Pick<File, "id" | "name" | "url" | "type">[];
	})[];
	lists: { list: Parameters<typeof ListCard>[0]["list"] }[];
	otherCompositions: Parameters<typeof CompositionCard>[0]["composition"][];
};

export const getComposition = cache(
	async (id: number): Promise<CompositionProfile | null> => {
		if (!id) return null;
		const session = await auth();
		if (!session) return null;

		const composition = await prisma.composition.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				approved: true,
				_count: { select: { users: true } },
				composers: {
					select: { id: true, name: true },
				},
				users: {
					where: { userId: session.user.id },
					select: {
						createdAt: true,
						updatedAt: true,
						startDate: true,
						endDate: true,
						notes: true,
						files: { select: { id: true, name: true, url: true, type: true } },
					},
				},
				lists: {
					where: { list: { custom: true } },
					select: {
						list: {
							select: {
								id: true,
								name: true,
								icon: true,
								_count: { select: { compositions: true } },
							},
						},
					},
					orderBy: { list: { savedBy: { _count: "desc" } } },
					take: 10,
				},
			},
		});
		if (!composition) return null;

		const otherCompositions = await prisma.composition.findMany({
			where: {
				id: { not: composition.id },
				composers: {
					some: { id: { in: composition.composers.map((a) => a.id) } },
				},
				OR: [{ approved: true }, { submittorId: session.user.id }],
			},
			select: {
				id: true,
				name: true,
				_count: {
					select: { users: true },
				},
				composers: { select: { id: true, name: true } },
			},
			orderBy: {
				users: { _count: "desc" },
			},
			take: 10,
		});

		return {
			...composition,
			otherCompositions,
		};
	}
);
