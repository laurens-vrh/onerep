import { PrismaClient } from "@prisma/client";

function prismaClientSingleton() {
	return new PrismaClient();
}

declare global {
	var prismaClient: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaClient ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaClient = prisma;
