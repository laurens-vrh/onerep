import { auth } from "@/lib/auth";
import {
	Composer,
	Composition,
	List,
	ListComposition,
	User,
	UserCompositionData,
} from "@prisma/client";
import { cache } from "react";
import { prisma } from "./prisma";
import { Update } from "./Update";

export type PublicUser = Pick<User, "id" | "username" | "role">;
export type PrivateUser = PublicUser & Pick<User, "email">;

export type CompositionWithComposers = Pick<Composition, "id" | "name"> & {
	composers: Pick<Composer, "id" | "name">[];
};

export type UserProfile = PublicUser &
	Pick<User, "createdAt"> & {
		lists: (Pick<
			List,
			| "id"
			| "name"
			| "icon"
			| "position"
			| "custom"
			| "description"
			| "userId"
			| "updatedAt"
		> & {
			compositions: (Pick<ListComposition, "position"> & {
				composition: CompositionWithComposers;
			})[];
			_count: { compositions: number };
		})[];
		compositions: (Pick<UserCompositionData, "createdAt" | "updatedAt"> & {
			composition: CompositionWithComposers;
		})[];
		savedLists: Pick<List, "id" | "name" | "icon">[];
		savedComposers: Pick<Composer, "id" | "name">[];
		updates: Update[];
		following: Pick<User, "id" | "username">[];
		followers: Pick<User, "id">[];
	};

export const getCurrentUser = cache(async (): Promise<PrivateUser | null> => {
	const session = await auth();
	if (!session || !session.user) return null;

	return prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		select: {
			id: true,
			username: true,
			role: true,
			email: true,
		},
	});
});

export const getUserProfileByUsername = cache(
	async (username: string): Promise<UserProfile | null> => {
		const user = await prisma.user.findUnique({
			where: { username },
			select: { id: true },
		});
		if (!user) return null;

		return getUserProfile(user.id);
	}
);

export const getUserProfile = cache(
	(id: string): Promise<UserProfile | null> => {
		return prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				role: true,
				createdAt: true,
				lists: {
					orderBy: { position: "asc" },
					select: {
						id: true,
						updatedAt: true,
						name: true,
						icon: true,
						position: true,
						custom: true,
						description: true,
						userId: true,
						compositions: {
							select: {
								position: true,
								composition: {
									select: {
										id: true,
										name: true,
										composers: { select: { id: true, name: true } },
									},
								},
							},
						},
						_count: {
							select: {
								compositions: true,
							},
						},
					},
				},
				compositions: {
					select: {
						createdAt: true,
						updatedAt: true,
						composition: {
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
					},
					orderBy: {
						createdAt: "desc",
					},
				},
				savedLists: { select: { id: true, name: true, icon: true } },
				savedComposers: { select: { id: true, name: true } },
				updates: {
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
					orderBy: {
						createdAt: "desc",
					},
				},
				following: {
					select: {
						id: true,
						username: true,
					},
				},
				followers: {
					select: {
						id: true,
					},
				},
			},
		});
	}
);
