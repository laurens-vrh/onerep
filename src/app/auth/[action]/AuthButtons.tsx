import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function AuthButtons({ callbackUrl }: { callbackUrl: string }) {
	return (
		<div className="space-y-2">
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
