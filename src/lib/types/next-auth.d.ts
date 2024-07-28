import { User as DatabaseUser } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: Pick<DatabaseUser, "id" | "username" | "email" | "role">;
	}

	interface User
		extends Optional<
			Pick<DatabaseUser, "id" | "username" | "email" | "role">
		> {}

	interface JWT extends User {}
}
