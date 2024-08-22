"use client";

import { ComposerDialog } from "@/components/dialogs/ComposerDialog";
import { CompositionDialog } from "@/components/dialogs/CompositionDialog";
import { Icons } from "@/components/Icons";
import { ListForm } from "@/components/inputs/ListForm";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { createList } from "@/lib/actions/list";
import { deleteAccount } from "@/lib/actions/user";
import { signOut as authSignOut, signOut } from "next-auth/react";
import { PrivateUser, UserProfile } from "@/lib/database/User";
import { listFormSchema, ListFormSchemaData } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CircleX,
	FileMusic,
	ListMusic,
	MenuIcon,
	MoonIcon,
	SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { list } from "postcss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MainSearch } from "./MainSearch";
import { Sidebar } from "./Sidebar";

export function Menu({
	user,
	showSidebar,
	setShowSidebar,
}: {
	user: PrivateUser & UserProfile;
	showSidebar: boolean;
	setShowSidebar: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const { resolvedTheme, setTheme } = useTheme();

	const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

	const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
	const [createListFormLoading, setCreateListFormLoading] = useState(false);

	const [addCompositionDialogOpen, setAddCompositionDialogOpen] =
		useState(false);
	const [addComposerDialogOpen, setAddComposerDialogOpen] = useState(false);
	const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

	const createListForm = useForm<ListFormSchemaData>({
		resolver: zodResolver(listFormSchema),
		defaultValues: {
			name: "New list",
			description: "",
			icon: 1,
		},
	});

	const renderSearch = useWindowSize().width > 640;
	const renderSidebar = useWindowSize().width < 1024;
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	useEffect(() => setSidebarOpen(false), [pathname]);

	async function onCreateListFormSubmit(values: ListFormSchemaData) {
		setCreateListFormLoading(true);
		const result = await createList(values);
		setCreateListFormLoading(false);
		setCreateListDialogOpen(false);
		createListForm.reset();

		if (!result.success)
			return toast(`Error creating list ${values.name}`, {
				description: result.error ?? "",
				icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
			});

		router.push("/app/list/" + result.listId);
		router.refresh();
	}

	return (
		<>
			<Button
				variant="outline"
				className="absolute top-1 left-1 z-30 p-1 w-8 h-8 lg:hidden"
				name="open sidebar"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				<MenuIcon className="w-4 h-4" />
			</Button>

			{renderSidebar && showSidebar && (
				<div
					className={cn(
						"absolute inset-0 top-10 z-20 border-t lg:hidden bg-black/50 transition-colors",
						!sidebarOpen && "bg-transparent pointer-events-none"
					)}
					onClick={() => setSidebarOpen(false)}
				>
					<div
						className={cn(
							"h-full max-w-[25rem] transition-transform border-r",
							!sidebarOpen && "translate-x-[-100%]"
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<Sidebar user={user} search={!renderSearch} />
					</div>
				</div>
			)}

			<Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>About OneRep</DialogTitle>
						<DialogDescription className="mt-1 grid gap-3">
							<p>
								Hello, I&apos;m Laurens! As a musician, I found it challenging
								to keep an organized record of all the pieces I had played,
								practiced, or wanted to play. OneRep is a dedicated tool I
								designed to simplify the process of managing a musician&apos;s
								repertoire, allowing artists to easily track their progress and
								share their musical accomplishments.
							</p>
							<p>
								The website is built using Next.js, and the source code is
								openly available on Github. Please report any bugs you find and
								share ideas you may have to improve the site!
							</p>
							<Button variant="outline" asChild>
								<a
									href="https://github.com/laurens-vrh/onerep"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icons.github className="w-4 h-4 mr-2" />
									Github
								</a>
							</Button>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog
				open={createListDialogOpen}
				onOpenChange={setCreateListDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create List</DialogTitle>
					</DialogHeader>

					<ListForm
						form={createListForm}
						onSubmit={onCreateListFormSubmit}
						isLoading={createListFormLoading}
					/>
				</DialogContent>
			</Dialog>
			<CompositionDialog
				open={addCompositionDialogOpen}
				setOpen={setAddCompositionDialogOpen}
			/>
			<ComposerDialog
				open={addComposerDialogOpen}
				setOpen={setAddComposerDialogOpen}
			/>
			<AlertDialog
				open={deleteAccountDialogOpen}
				onOpenChange={setDeleteAccountDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete your account?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will delete all of your data from our servers. This includes
							all of your lists, notes, sheet music, etc. This action is
							irreversible.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={async () => {
								if (!list) return;

								deleteAccount();
								signOut();
								setDeleteAccountDialogOpen(false);
							}}
						>
							Delete Account
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Menubar className="rounded-none border-none px-2 pl-8 lg:px-4 max-sm:flex-wrap max-sm:h-fit sm:h-10">
				<MenubarMenu>
					<MenubarTrigger className="font-bold">
						<Icons.logo className="w-5 h-5 mr-1" />
						OneRep
					</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>
							<Link href="/?landing=true">Landing Page</Link>
						</MenubarItem>
						<MenubarItem onClick={() => setAboutDialogOpen(true)}>
							About OneRep
						</MenubarItem>
						<MenubarSeparator />
						<MenubarItem>
							<Link href="/documents/terms_of_service.html">
								Terms of Service
							</Link>
						</MenubarItem>
						<MenubarItem>
							<Link href="/documents/privacy_policy.html">Privacy Policy</Link>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger className="max-[400px]:px-1">Create</MenubarTrigger>
					<MenubarContent>
						<MenubarItem
							onClick={() => {
								setCreateListDialogOpen(true);
								createListForm.setFocus("name");
							}}
						>
							<ListMusic className="w-4 h-4 mr-2" />
							List
						</MenubarItem>
						<MenubarSeparator />
						<MenubarItem onClick={() => setAddCompositionDialogOpen(true)}>
							<FileMusic className="w-4 h-4 mr-2" />
							Composition
						</MenubarItem>
						<MenubarItem onClick={() => setAddComposerDialogOpen(true)}>
							<Icons.composer className="w-4 h-4 mr-2" />
							Composer
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger className="max-[400px]:px-1">View</MenubarTrigger>
					<MenubarContent>
						<MenubarCheckboxItem
							checked={showSidebar}
							onCheckedChange={setShowSidebar}
							className="cursor-pointer"
						>
							Show Sidebar
						</MenubarCheckboxItem>
						<MenubarItem
							onSelect={() =>
								setTheme(resolvedTheme === "light" ? "dark" : "light")
							}
						>
							{resolvedTheme === "light" ? (
								<>
									<MoonIcon className="w-4 h-4 mr-2" />
									Enable Dark Mode
								</>
							) : (
								<>
									<SunIcon className="w-4 h-4 mr-2" />
									Enable Light Mode
								</>
							)}
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger className="max-[400px]:px-1">Account</MenubarTrigger>
					<MenubarContent>
						<MenubarLabel className="pb-0">@{user.username}</MenubarLabel>
						<MenubarItem disabled className="pt-0">
							{user.email}
						</MenubarItem>
						<MenubarSeparator />
						<MenubarItem onSelect={(event) => event.preventDefault()} asChild>
							<button className="w-full" onClick={() => authSignOut()}>
								Sign Out
							</button>
						</MenubarItem>
						<MenubarItem
							className="text-destructive hover:bg-destructive hover:text-white"
							onClick={() => setDeleteAccountDialogOpen(true)}
						>
							Delete Account
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>

				{renderSearch && <MainSearch user={user} />}
			</Menubar>
		</>
	);
}
