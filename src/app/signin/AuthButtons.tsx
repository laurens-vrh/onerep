"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";

export function AuthButtons() {
	const params = useParams<{ redirectTo?: string }>();
	const callbackUrl = params.redirectTo ?? "/app";

	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const errorMessage =
		error === "OAuthAccountNotLinked"
			? "Error: To access your account, please sign in using the same method you used when you first created it."
			: "Error signing in: " + error;

	return (
		<div className="space-y-2">
			{error && (
				<p className="text-center font-semibold text-sm text-destructive">
					{errorMessage}
				</p>
			)}
			<Button
				variant="outline"
				className="w-full"
				onClick={() => signIn("google", { callbackUrl })}
			>
				<Icons.google className="mr-2 h-4 w-4" />
				Sign in with Google
			</Button>
			<Button
				variant="outline"
				className="w-full"
				onClick={() => signIn("discord", { callbackUrl })}
			>
				<Icons.discord className="mr-2 h-4 w-4" />
				Sign in with Discord
			</Button>
			<Button
				variant="outline"
				className="w-full"
				onClick={() => signIn("github", { callbackUrl })}
			>
				<Icons.github className="mr-2 h-4 w-4" />
				Sign in with Github
			</Button>
			<Button
				variant="outline"
				className="w-full"
				onClick={() => signIn("twitch", { callbackUrl })}
			>
				<Icons.twitch className="mr-2 h-4 w-4" />
				Sign in with Twitch
			</Button>
		</div>
	);
}
