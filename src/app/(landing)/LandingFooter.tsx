import { Separator } from "@/components/ui/separator";

export function LandingFooter() {
	return (
		<footer id="footer">
			<Separator />

			<section className="container py-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-8">
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-bold text-xl">OneRep</p>
					<a
						target="_blank"
						rel="noreferrer noopener"
						href="/documents/terms_of_service.html"
						className="opacity-60 hover:opacity-100"
					>
						Terms of Service
					</a>
					<a
						target="_blank"
						rel="noreferrer noopener"
						href="/documents/privacy_policy.html"
						className="opacity-60 hover:opacity-100"
					>
						Privacy Policy
					</a>
					<a
						target="_blank"
						rel="noreferrer noopener"
						href="https://github.com/laurens-vrh/onerep"
						className="opacity-60 hover:opacity-100"
					>
						Github
					</a>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="font-bold text-lg">Contact</h3>
					<p className="text-muted-foreground">
						Please contact me if you have any problems or want to share ideas.
						Feel free to open an issue on Github or reach out to me on Discord:
						@laurens.vrh
					</p>
				</div>
			</section>
		</footer>
	);
}
