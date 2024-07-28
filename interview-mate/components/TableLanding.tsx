import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import React from "react";

export default function TableLanding() {
	return (
		<div id="#whyChooseUs">
			<div className="pb-10 text-5xl font-bold">Why Choose us:</div>
			<Table className="">
				<TableHeader>
					<TableRow>
						<TableHead>Feature</TableHead>
						<TableHead>InterviewMate</TableHead>
						<TableHead>Traditional Interview</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="font-medium">
							AI-Driven Question Suggestions
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">
							Real-Time Performance Analysis
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">
							Customizable Question Refresh
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">
							Mock Interviews with AI Feedback
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">
							Structured Evaluation Framework
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">
							Seamless Integration with Video Tools
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">
							Personalized Preparation for Candidates
						</TableCell>
						<TableCell>
							<Check />
						</TableCell>
						<TableCell>
							<X />
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
