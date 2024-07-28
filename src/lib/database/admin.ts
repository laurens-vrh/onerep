import { Role } from "@prisma/client";
import { cache } from "react";
import { prisma } from "./prisma";
import { getCurrentUser } from "./User";

export const getStatistics = cache(async () => {
	const user = await getCurrentUser();
	if (user?.role !== Role.ADMIN) return null;

	return {
		users: prisma.user.count(),
		accounts: prisma.account.count(),
		lists: prisma.list.count(),
		customLists: prisma.list.count({
			where: { custom: true },
		}),
		compositions: prisma.composition.count({ where: { approved: true } }),
		unapprovedCompositions: prisma.composition.count({
			where: { approved: null },
		}),
		disapprovedCompositions: prisma.composition.count({
			where: { approved: false },
		}),
		composers: prisma.composer.count({ where: { approved: true } }),
		unapprovedComposers: prisma.composer.count({ where: { approved: null } }),
		disapprovedComposers: prisma.composer.count({ where: { approved: false } }),
	};
});

export const getComposers = cache(async () => {
	const user = await getCurrentUser();
	if (user?.role !== Role.ADMIN) return null;

	return prisma.composer.findMany({
		orderBy: { name: "asc" },
		select: {
			id: true,
			name: true,
			approved: true,
			_count: { select: { compositions: true, savedBy: true } },
		},
	});
});

export const getCompositions = cache(async () => {
	const user = await getCurrentUser();
	if (user?.role !== Role.ADMIN) return null;

	return prisma.composition.findMany({
		orderBy: { name: "asc" },
		select: {
			id: true,
			name: true,
			approved: true,
			composers: {
				select: { name: true },
			},
			_count: { select: { lists: true, users: true } },
		},
	});
});
