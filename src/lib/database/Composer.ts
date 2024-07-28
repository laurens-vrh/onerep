import { ListCard } from "@/components/cards/ListCard";
import { Composer, Composition } from "@prisma/client";
import { cache } from "react";
import { auth } from "../auth";
import { prisma } from "./prisma";

export type ComposerProfile = Pick<Composer, "id" | "name" | "approved"> & {
	_count: {
		savedBy: number;
	};
	lists: Parameters<typeof ListCard>[0]["list"][];
	compositions: (Pick<Composition, "id" | "name"> & {
		_count: { users: number };
	})[];
};

export const getComposer = cache(
	async (id: number): Promise<ComposerProfile | null> => {
		const session = await auth();
		if (!session) return null;

		const [composer, listsWithComposer] = await Promise.all([
			prisma.composer.findUnique({
				where: { id },
				select: {
					id: true,
					name: true,
					approved: true,
					_count: { select: { savedBy: true } },
					compositions: {
						where: {
							OR: [{ approved: true }, { submittorId: session.user.id }],
						},
						select: {
							id: true,
							name: true,
							_count: { select: { users: true } },
						},
						orderBy: {
							users: { _count: "desc" },
						},
					},
				},
			}),
			prisma.list.findMany({
				where: {
					custom: true,
					compositions: {
						some: {
							composition: {
								composers: {
									some: {
										id,
									},
								},
							},
						},
					},
				},
				select: {
					id: true,
					name: true,
					icon: true,
					_count: { select: { compositions: true } },
				},
				orderBy: {
					savedBy: { _count: "desc" },
				},
				take: 10,
			}),
		]);
		if (!composer) return null;

		return { ...composer, lists: listsWithComposer };
	}
);
