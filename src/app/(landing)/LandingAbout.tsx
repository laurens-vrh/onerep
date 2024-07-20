import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";

export function LandingAbout() {
	return (
		<section id="about" className="container py-24 sm:py-32">
			<div className="bg-muted/50 border rounded-lg py-12">
				<div className="px-6 md:px-16 flex flex-col md:flex-row md:justify-between justify-start gap-8">
					<div className="max-w-[80ch] flex-shrink">
						<h2 className="text-3xl md:text-4xl font-bold">
							<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
								About{" "}
							</span>
							OneRep
						</h2>
						<p className="text-xl text-muted-foreground mt-4">
							Hello, I&apos;m Laurens! As a musician, I found it challenging to
							keep an organized record of all the pieces I had played,
							practiced, or wanted to play. OneRep is a dedicated tool I
							designed to simplify the process of managing a musician&apos;s
							repertoire, allowing artists to easily track their progress and
							share their musical accomplishments.
						</p>
					</div>

					<div className="flex-shrink-0 flex flex-col h-min m-auto w-60 lg:w-72 bg-background rounded-lg border p-4 pt-1">
						<p className="ml-4 mt-4 text-lg font-semibold tracking-tight">
							Library
						</p>
						{[
							{
								name: "Repertoire",
								icon: 0,
							},
							{
								name: "Want to play",
								icon: 1,
							},
							{
								name: "Archive",
								icon: 2,
							},
							{
								name: "Favorites",
								icon: 3,
							},
						].map((list) => {
							const Icon = Icons.listIcons[list.icon];
							return (
								<Button
									key={list.name}
									variant="ghost"
									className="justify-start"
								>
									<Icon className="mr-2 h-4 w-4" />
									{list.name}
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
