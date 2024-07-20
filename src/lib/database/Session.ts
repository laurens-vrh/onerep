import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "./prisma";
import { Session } from "@prisma/client";

export const getSession = cache(
	async (id?: string): Promise<Pick<Session, "userId"> | null> => {
		const sessionId = id ?? cookies().get("onerep:session")?.value;
		if (!sessionId) return null;

		return await prisma.session.findUnique({
			where: { id: sessionId },
			select: {
				userId: true,
			},
		});
	}
);
