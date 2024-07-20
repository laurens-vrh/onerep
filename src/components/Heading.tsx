import { cn } from "@/lib/utils";
import React from "react";

export function Heading({
	className,
	level,
	children,
}: {
	className?: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	children: React.ReactNode | string;
}) {
	const headings = [
		<h1 key={1} className={cn("text-xl font-bold", className)}>
			{children}
		</h1>,
		<h2 key={2} className={cn("text-xl font-bold", className)}>
			{children}
		</h2>,
		<h3 key={3} className={cn("font-semibold", className)}>
			{children}
		</h3>,
		<h4 key={4} className={cn("", className)}>
			{children}
		</h4>,
		<h5 key={5} className={cn("", className)}>
			{children}
		</h5>,
		<h6 key={6} className={cn("", className)}>
			{children}
		</h6>,
	];

	return headings[level - 1];
}
