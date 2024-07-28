import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionLanding() {
	return (
		<div>
			<p className="font-bold text-5xl pb-10">Learn More</p>
			<div className="px-2">
				<div className="text-3xl pb-3 font-bold">For Interviewers</div>
				<Accordion
					type="single"
					collapsible
					className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger className="font-bold">
							AI-Driven Question Suggestions
						</AccordionTrigger>
						<AccordionContent>
							Generate and adjust job-specific questions based on
							the role.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="font-bold">
							In-Depth Performance Analysis
						</AccordionTrigger>
						<AccordionContent>
							Assess candidates with detailed reports on key
							criteria.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger className="font-bold">
							Seamless Integration
						</AccordionTrigger>
						<AccordionContent>
							Easily connect with your current systems for smooth
							use.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className="px-2">
				<div className="text-3xl pb-3 font-bold pt-10">
					For Interviewees
				</div>
				<Accordion type="single">
					<AccordionItem value="item-1">
						<AccordionTrigger className="font-bold">
							Mock Interviews with AI
						</AccordionTrigger>
						<AccordionContent>
							Practice with role-specific questions and get
							feedback.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="font-bold">
							Preparation Insights
						</AccordionTrigger>
						<AccordionContent>
							Practice with role-specific questions and get
							feedback.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger className="font-bold">
							Self-Assessment Tools
						</AccordionTrigger>
						<AccordionContent>
							Track and improve your interview performance over
							time.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
