import { DatePicker } from "@/components/inputs/DatePicker";
import { SeparatorDot } from "@/components/SeparatorDot";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
	ArrowRight,
	Check,
	DownloadIcon,
	FileMusic,
	Library,
	ListMusic,
	Music4,
	PianoIcon,
	PlusIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { LandingHeroCard } from "./LandingHeroCard";
import styles from "@/styles/LandingHero.module.css";

export function LandingHero() {
	return (
		<section className="container grid grid-flow-row lg:grid-cols-2 place-items-center pt-32 lg:py-20 gap-10 overflow-x-hidden xl:overflow-visible">
			<div className="text-center lg:text-start space-y-6 max-lg:mb-16">
				<main className="text-5xl md:text-6xl font-bold">
					<h1 className="inline">
						Your Online Musical{" "}
						<span className="inline bg-gradient-to-tr from-primary to-primary/50 text-transparent bg-clip-text">
							Repertoire
						</span>
					</h1>
				</main>

				<p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
					The all-in-one tool for musicians to manage and share their repertoire
					and favorite pieces
				</p>

				<div className="space-y-4 md:space-y-0 md:space-x-4">
					<Button className="w-full md:w-fit" asChild>
						<Link href="/auth/signup">
							Start Organizing Your Music{" "}
							<ArrowRight className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>

			<div className="z-10 max-md:overflow-x-hidden pb-8">
				<div className="flex flex-row flex-wrap gap-4 sm:gap-8 relative w-[620px] sm:h-[508px] max-sm:w-screen [&>*]:max-sm:static [&>*]:max-sm:mx-4 [&>*]:max-sm:w-full">
					<LandingHeroCard
						className="left-0 bottom-0 w-80"
						title="Track compositions"
						icon={Music4}
					>
						<div className="rounded-sm px-3 py-2 border outline-none flex items-center mb-1">
							<FileMusic className="mr-2 h-6 w-6" />
							<div className="grid grid-cols-1">
								<span className="w-full">Moonlight Sonata</span>
								<span className="text-sm">By Ludwig van Beethoven</span>
							</div>
						</div>
						<div className="h-min grid grid-cols-[max-content_1fr] gap-y-1 gap-x-2 items-center pointer-events-none">
							<span className="text-right">Started</span>
							<DatePicker date={new Date(Date.now() - 7 * 24 * 3600 * 1000)} />
							<span className="text-right">Finished</span>
							<DatePicker date={undefined} />
							<span className="text-right">Sheets</span>
							<div className="flex-1 flex justify-start border rounded-md text-sm px-4 py-2 items-center">
								<DownloadIcon className="w-4 h-4 mr-2" />
								Moonlight_Sonata.pdf
							</div>
						</div>
					</LandingHeroCard>

					<LandingHeroCard
						className="w-72 right-0 top-5"
						title="Follow Friends"
						icon={UserIcon}
					>
						<p className="text-xs">{format(new Date(), "PPP")}</p>
						<p className="mb-2">
							@laurens added Maple Leaf Rag to their repertoire!
						</p>

						<div className="rounded-sm px-3 py-2 border flex items-center">
							<FileMusic className="mr-2 h-6 w-6" />
							<div className="grid grid-cols-1">
								<span className="w-full">Maple Leaf Rag</span>
								<span className="text-sm">By Scott Joplin</span>
							</div>
						</div>
					</LandingHeroCard>

					<LandingHeroCard
						className="w-70 left-12 top-0"
						title="Manage Lists"
						icon={ListMusic}
					>
						<div className="flex items-center rounded-sm px-3 py-2 border">
							<PianoIcon className="mr-2 h-6 w-6" />
							<div className="grid grid-cols-1">
								<span className="w-full">Ragtime</span>
								<span className="text-sm">
									By @laurens <SeparatorDot /> 31 pieces
								</span>
							</div>
						</div>
						<div className="mt-1 flex items-center rounded-sm px-3 py-2 border">
							<Library className="mr-2 h-6 w-6" />
							<div className="grid grid-cols-1">
								<span className="w-full">Archive</span>
								<span className="text-sm">
									By @laurens <SeparatorDot /> 58 pieces
								</span>
							</div>
						</div>
					</LandingHeroCard>

					<LandingHeroCard
						className="right-[3.75rem] bottom-8 w-54"
						title="And more..."
						icon={PlusIcon}
					>
						<div className="mt-4 space-y-2">
							{[
								"Add missing compositions",
								"Explore lists",
								"Upload performances",
								"Take notes",
							].map((benefit) => (
								<span key={benefit} className="flex items-center sm:max-w-44">
									<Check className="w-4 h-4 mr-2 text-primary" />
									{benefit}
								</span>
							))}
						</div>
					</LandingHeroCard>
				</div>
			</div>

			<div className={styles.shadow} />
		</section>
	);
}
