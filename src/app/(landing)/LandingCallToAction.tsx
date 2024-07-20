import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function LandingCallToAction() {
	{
		return (
			<section id="cta" className="bg-muted/50 py-16 my-24 sm:my-32">
				<div className="container lg:grid lg:grid-cols-2 place-items-center">
					<div className="lg:col-start-1">
						<h2 className="text-3xl md:text-4xl font-bold ">
							Your Music tells a
							<span className="bg-gradient-to-b from-primary/50 to-primary text-transparent bg-clip-text">
								{" "}
								Story
							</span>
							.<br /> Let
							<span className="bg-gradient-to-b from-primary/50 to-primary text-transparent bg-clip-text">
								{" "}
								OneRep{" "}
							</span>
							help you write it down.
						</h2>
						<p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
							Create a living archive of your musical journey - from pieces
							mastered to dreams yet to be played. Use OneRep to track your
							played pieces, log your musical ambitions, and share your
							progress. Start building your personal music archive today!
						</p>
					</div>

					<div className="space-y-4 lg:col-start-2">
						<Button asChild variant="default">
							<Link href="/auth/signup">
								Start Organizing <ArrowRight className="w-4 h-4 ml-2" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
		);
	}
}
