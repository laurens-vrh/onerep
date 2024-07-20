import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Heading } from "./Heading";
import { cn } from "@/lib/utils";

export function GridCard({
	title,
	forceSingle,
	children: cards,
}: {
	title: ReactNode;
	forceSingle?: boolean;
	children: ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="pt-5 pb-2">
				<Heading level={3}>{title}</Heading>
			</CardHeader>
			<CardContent
				className={cn(
					"grid gap-2 grid-cols-1 sm:grid-cols-2",
					!forceSingle
						? "md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
						: "md:grid-cols-1"
				)}
			>
				{cards}
			</CardContent>
		</Card>
	);
}
