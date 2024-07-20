import { User } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export function UserCard({ user }: { user: Pick<User, "id" | "username"> }) {
	return (
		<Link href={`/app/user/${user.id}`}>
			<li className="flex cursor-pointer select-none items-center rounded-sm px-3 py-2 border outline-none hover:bg-accent">
				<UserIcon className="mr-2 h-6 w-6" />@{user.username}
			</li>
		</Link>
	);
}
