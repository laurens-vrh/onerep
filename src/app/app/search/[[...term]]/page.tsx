import { getCurrentUser, getUserProfile } from "@/database/User";
import { redirect } from "next/navigation";
import { SearchResults } from "./SearchResults";
import { Heading } from "@/components/Heading";
import { PageHeader } from "@/components/PageHeader";
import { Search } from "lucide-react";
import { Metadata } from "next";

export default async function Page({ params }: { params: { term?: string } }) {
	const term = params.term?.[0];
	const user = (await getUserProfile((await getCurrentUser())!.id))!;
	if (!term) return redirect("/app");

	return (
		<div>
			<PageHeader
				icon={Search}
				title={decodeURIComponent(term)}
				type="Search Results"
				small={true}
			/>
			<SearchResults term={term} user={user} />
		</div>
	);
}

export const metadata: Metadata = {
	title: "Search",
};
