"use client";

import { EditListButton } from "@/components/buttons/EditListButton";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/database/User";
import { List, Role } from "@prisma/client";
import {
	CircleUser,
	LayoutPanelTop,
	LockKeyholeOpen,
	Pencil,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainSearch } from "./MainSearch";
import { readableUrl } from "@/lib/utils";

export function Sidebar({
	user,
	search,
}: {
	user: UserProfile;
	search?: boolean;
}) {
	const pathname = usePathname();
	const nonCustomLists = user.lists.filter((list) => !list.custom);
	const customLists = user.lists.filter((list) => list.custom);

	const friends = user.following.filter(
		(u) => !!user.followers.find((u2) => u.id === u2.id)
	);
	const following = user.following.filter(
		(u) => !user.followers.find((u2) => u.id === u2.id)
	);

	function listLink({
		editable,
		list,
	}:
		| {
				editable: false;
				list: Pick<List, "id" | "name" | "icon">;
		  }
		| {
				editable: true;
				list: Pick<List, "id" | "name" | "icon" | "description">;
		  }) {
		const Icon = Icons.listIcons[list.icon];
		const url = readableUrl("list", list);
		return (
			<div
				key={list.id}
				className={`flex w-full items-center rounded-md group ${
					pathname === url ? "bg-secondary" : ""
				} hover:bg-secondary`}
			>
				<Button
					variant="ghost"
					className="justify-start hover:bg-transparent pr-0"
					asChild
				>
					<Link href={url} className="flex-1">
						<Icon className="mr-2 h-4 w-4" />
						{list.name}
					</Link>
				</Button>
				{editable && (
					<EditListButton
						list={list}
						button={
							<Pencil className="w-12 h-10 px-4 py-3 hidden group-hover:block text-muted-foreground" />
						}
					/>
				)}
			</div>
		);
	}

	function userLink(username: string) {
		const url = "/app/user/" + username;
		return (
			<Button
				key={username}
				variant={pathname === url ? "secondary" : "ghost"}
				className="w-full justify-start"
				asChild
			>
				<Link href={url}>
					<UserIcon className="mr-2 h-4 w-4" />@{username}
				</Link>
			</Button>
		);
	}

	return (
		<>
			<ScrollArea className="p-4 relative h-full min-w-min bg-background">
				{search && (
					<div className="mb-2">
						<MainSearch user={user} full={true} />
					</div>
				)}
				<Button
					variant={pathname === "/app" ? "secondary" : "ghost"}
					className="w-full justify-start"
					asChild
				>
					<Link href="/app">
						<LayoutPanelTop className="mr-2 h-4 w-4" />
						Home
					</Link>
				</Button>
				<Button
					variant={
						pathname === "/app/user/" + user.username ? "secondary" : "ghost"
					}
					className="w-full justify-start"
					asChild
				>
					<Link href={"/app/user/" + user.username}>
						<CircleUser className="mr-2 h-4 w-4" />
						Profile
					</Link>
				</Button>

				<p className="mt-4 px-4 text-lg font-semibold tracking-tight">
					Library
				</p>
				<div>
					{nonCustomLists.map((list) => listLink({ list, editable: true }))}
					{customLists.length > 0 && (
						<Separator className="my-2 mx-auto w-[calc(100%-2*12px)]" />
					)}
					{customLists.map((list) => listLink({ list, editable: true }))}
					{customLists.length + nonCustomLists.length > 0 &&
						user.savedLists.length + user.savedComposers.length > 0 && (
							<Separator className="my-2 mx-auto w-[calc(100%-2*12px)]" />
						)}
					{user.savedLists.map((list) => listLink({ list, editable: false }))}
					{user.savedComposers.map((composer) => {
						const url = readableUrl("composer", composer);
						return (
							<Button
								key={composer.id}
								variant={pathname === url ? "secondary" : "ghost"}
								className="w-full justify-start"
								asChild
							>
								<Link href={url}>
									<Icons.composer className="mr-2 h-4 w-4" />
									{composer.name}
								</Link>
							</Button>
						);
					})}
				</div>
				{friends.length + following.length > 0 && (
					<>
						<p className="mt-4 px-4 text-lg font-semibold tracking-tight">
							Friends
						</p>
						<div>
							{friends.map((u) => userLink(u.username))}
							{friends.length > 0 && following.length > 0 && (
								<Separator className="my-2 mx-auto w-[calc(100%-2*12px)]" />
							)}
							{following.map((u) => userLink(u.username))}
						</div>
					</>
				)}

				{user.role === Role.ADMIN && (
					<Button
						variant="outline"
						className="absolute bottom-2 w-[calc(100%-2*12px)] justify-start"
						asChild
					>
						<Link href="/app/admin">
							<LockKeyholeOpen className="mr-2 h-4 w-4" />
							Admin Dashboard
						</Link>
					</Button>
				)}
			</ScrollArea>
		</>
	);
}
