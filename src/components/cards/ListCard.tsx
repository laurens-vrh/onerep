import { List, User } from "@prisma/client";
import Link from "next/link";
import { Icons } from "../Icons";
import { SeparatorDot } from "../SeparatorDot";

export function ListCard({
	list,
	showUser,
}: {
	list: Pick<List, "id" | "name" | "icon"> & {
		user?: Pick<User, "id" | "username">;
		_count: {
			compositions: number;
		};
	};
	showUser?: boolean;
}) {
	const Icon = Icons.listIcons[list.icon];

	return (
		<div className="relative" key={list.id}>
			<Link
				href={`/app/list/${list.id}`}
				className="absolute inset-0 peer"
			></Link>
			<li className="flex cursor-pointer select-none items-center rounded-sm px-3 py-2 border outline-none peer-hover:bg-accent">
				<Icon className="mr-2 h-6 w-6" />
				<div className="grid grid-cols-1">
					<span className="w-full">{list.name}</span>
					<span className="text-sm">
						{showUser !== false && list.user && (
							<>
								By
								<Link
									href={`/app/user/${list.user.id}`}
									className="ml-[0.2rem] font-semibold hover:underline relative z-10"
								>
									@{list.user.username}
								</Link>
								<SeparatorDot />
							</>
						)}
						{list._count.compositions} compositions
					</span>
				</div>
			</li>
		</div>
	);
}
