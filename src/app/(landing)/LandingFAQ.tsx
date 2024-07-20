import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
	{
		question: "Is OneRep free to use?",
		answer: "Yes! OneRep is free to use for everyone, without limitations.",
	},
	{
		question: "Can I use OneRep on my mobile device?",
		answer:
			"Yes, OneRep is fully responsive and can be accessed through any modern web browser on your smartphone or tablet. A dedicated app is not yet available.",
	},
	{
		question:
			"How do I add a piece of music that's not in the existing database?",
		answer:
			"If a piece isn't in our database, you can easily add it manually. Just click on 'Create > Composition' in the menu and fill in the details like the title and composer. If the composer is also not yet in the database, you will need to add them first using the 'Create > Composer' option in the menu.",
	},
	{
		question: "Can I share my repertoire with others?",
		answer:
			"Absolutely! OneRep allows you to share your repertoire or any other list with other users. Click the share button on a list page to copy the link.",
	},
	{
		question: "Which data is private and public?",
		answer:
			"Your lists are public by default. Any dates you associate with your compositions are also public, but files, like sheet music and performances, and custom notes are only visible to you.",
	},
	{
		question: "How do I categorize pieces I'm currently learning?",
		answer:
			"You can use the 'Want to play' list for pieces you're currently learning. You can also create custom lists using the 'Create > List' option in the menu, so you might make a 'Currently Learning' or 'In Progress' list for these pieces.",
	},
	{
		question: "Can I upload my own sheet music or recordings?",
		answer:
			"Yes, OneRep allows you to upload PDF files of sheet music and audio recordings for each piece in your repertoire, with a file size limit of 5MB. These uploads are private.",
	},
	{
		question: "Is there a limit to how many pieces I can add to my repertoire?",
		answer:
			"No, you're able to add as many compositions to your Library as you wish.",
	},
];

export function LandingFAQ() {
	return (
		<section id="faq" className="container py-24 sm:py-32 max-w-[80ch]">
			<h2 className="text-3xl md:text-4xl font-bold mb-4 md:text-center">
				Frequently Asked Questions
			</h2>

			<Accordion type="single" collapsible className="w-full">
				{questions.map(({ question, answer }, index) => (
					<AccordionItem key={index} value={index.toString()}>
						<AccordionTrigger className="text-left">
							{question}
						</AccordionTrigger>

						<AccordionContent>{answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			<h3 className="font-medium mt-4">
				Still have questions? Contact me on Github or Discord.
			</h3>
		</section>
	);
}
