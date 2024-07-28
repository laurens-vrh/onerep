"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="grid w-full h-full place-items-center">
			<Heading level={2}>Something went wrong!</Heading>
			<Button className="mt-2" onClick={() => reset()}>
				Try again
			</Button>
		</div>
	);
}
