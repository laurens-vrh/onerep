import { DataTable } from "@/components/DataTable";
import { Heading } from "@/components/Heading";
import {
	getComposers,
	getCompositions,
	getStatistics,
} from "@/lib/database/admin";
import { composerColumns } from "./ComposerTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListMusic, FileMusic, User, Users } from "lucide-react";
import { redirect } from "next/navigation";
import {
	TableComposer,
	unapprovedComposerBulkActions,
	unapprovedComposerColumns,
} from "./UnapprovedComposerTable";
import {
	unapprovedCompositionColumns,
	unapprovedCompositionBulkActions,
	TableComposition,
} from "./UnapprovedCompositionTable";
import { compositionColumns } from "./CompositionTable";
import { Icons } from "@/components/Icons";
import { Metadata } from "next";

export default async function Page() {
	const stats = await getStatistics();
	if (!stats) redirect("/app");

	const composers = (await getComposers()) ?? [];
	const compositions = (await getCompositions()) ?? [];

	return (
		<>
			<Heading level={1}>Administrator Dashboard</Heading>

			<Tabs defaultValue="overview" className="mt-2">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="composers">Composers</TabsTrigger>
					<TabsTrigger value="compositions">Compositions</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Users</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.users}</div>
								<p className="text-xs text-muted-foreground">
									{stats.sessions} sessions
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Lists</CardTitle>
								<ListMusic className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.lists}</div>
								<p className="text-xs text-muted-foreground">
									{stats.customLists} custom
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Compositions
								</CardTitle>
								<FileMusic className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.compositions}</div>
								<p className="text-xs text-muted-foreground">
									+{stats.unapprovedCompositions} unverified /{" "}
									{stats.disapprovedCompositions} disapproved
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Composers</CardTitle>
								<Icons.composer className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stats.composers}</div>
								<p className="text-xs text-muted-foreground">
									+{stats.unapprovedComposers} unverified /{" "}
									{stats.disapprovedComposers} disapproved
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid mt-4 gap-4 grid-cols-2">
						<Card>
							<CardHeader className="pb-0 font-semibold">
								<h2>Unverified composers</h2>
							</CardHeader>
							<CardContent>
								<DataTable
									columns={unapprovedComposerColumns}
									data={composers.filter((a) => a.approved === null)}
									searchColumn="name"
									bulkActions={unapprovedComposerBulkActions}
									viewOptions={false}
								/>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-0 font-semibold">
								<h2>Unverified compositions</h2>
							</CardHeader>
							<CardContent>
								<DataTable
									columns={unapprovedCompositionColumns}
									data={compositions.filter((c) => c.approved === null)}
									searchColumn="name"
									bulkActions={unapprovedCompositionBulkActions}
									viewOptions={false}
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="composers" className="w-full">
					<DataTable
						columns={composerColumns}
						data={composers.filter((a) => a.approved)}
						searchColumn="name"
						bulkActions={[]}
					/>
				</TabsContent>

				<TabsContent value="compositions">
					<DataTable
						columns={compositionColumns}
						data={compositions.filter((c) => c.approved)}
						searchColumn="name"
						bulkActions={[]}
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}

export const metadata: Metadata = {
	title: "Administrator Dashboard",
};
