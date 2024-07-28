import { PrismaClient } from "@prisma/client";

function prismaClientSingleton() {
	return new PrismaClient().$extends({
		query: {
			user: {
				async create({ query, args }) {
					const user = await query(args);
					if (!user.id) return user;

					await prisma.list.createMany({
						data: [
							{
								name: "Repertoire",
								userId: user.id,
								icon: 0,
								custom: false,
								description: "Compositions you can currently play",
								position: 1,
							},
							{
								name: "Want to play",
								userId: user.id,
								icon: 1,
								custom: false,
								position: 2,
							},
							{
								name: "Archive",
								userId: user.id,
								icon: 2,
								custom: false,
								position: 3,
							},
							{
								name: "Favorites",
								userId: user.id,
								icon: 3,
								custom: false,
								position: 4,
							},
						],
					});
					return user;
				},
			},
		},
	});
}

declare global {
	var prismaClient: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaClient ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaClient = prisma;
