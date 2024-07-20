import { LandingAbout } from "./LandingAbout";
import { LandingCallToAction } from "./LandingCallToAction";
import { LandingExplanation } from "./LandingExplanation";
import { LandingFAQ } from "./LandingFAQ";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";
import { LandingMenu } from "./LandingMenu";

export default async function Landing() {
	return (
		<>
			<LandingMenu />
			<LandingHero />
			<LandingAbout />
			<LandingExplanation />
			<LandingCallToAction />
			<LandingFAQ />
			<LandingFooter />
		</>
	);
}
