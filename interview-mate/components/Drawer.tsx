"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import Image from "next/image";
import DateTimeDisplay from "./TimeConverter";
import { RatingBar } from "./RatingBar";
import { Badge } from "./ui/badge";

interface Meeting {
	id: number;
	description: string;
	meetingId: string;
	users: string;
	analysis: string; // Note: Changed to string
	dateAndTime: string;
}

interface AnalysisResult {
	communication_skills: SkillRating;
	cultural_fit: SkillRating;
	overall_rating: SkillRating;
	technical_skills: SkillRating;
}

interface SkillRating {
	comment: string;
	rating: string;
}

export function DrawerComp({ meetingId }: { meetingId: string }) {
	const { needAnalysis } = useSendSpeech();
	const [isLoading, setIsLoading] = React.useState(true);
	const [meetingDetails, setMeetingDetails] = React.useState<Meeting | null>(
		null
	);
	const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null);
	const meetingType = meetingId.includes("meeting");

	const getAnalysis = async (roomId: string) => {
		setIsLoading(true);
		try {
			const res: any = await needAnalysis(roomId);
			setMeetingDetails(res);

			// Parse the analysis string if it's present
			if (res.analysis) {
				try {
					const parsedAnalysis = JSON.parse(res.analysis);
					setAnalysis(parsedAnalysis);
				} catch (parseError) {
					console.error("Failed to parse analysis:", parseError);
				}
			}
		} catch (error) {
			console.error("Failed to fetch analysis:", error);
		} finally {
			setIsLoading(false);
		}
	};

	function extractEmails(emailString: string): string[] {
		// Regular expression pattern for matching email addresses
		const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

		// Find all matches in the input string
		const emails: RegExpMatchArray | null = emailString.match(emailPattern);

		// Create an array to hold unique emails
		const uniqueEmails: string[] = [];

		if (emails) {
			for (const email of emails) {
				// Only add unique emails
				if (!uniqueEmails.includes(email)) {
					uniqueEmails.push(email);
				}
			}
		}

		return uniqueEmails;
	}

	if (meetingDetails?.users) {
		console.log(extractEmails(meetingDetails?.users));
	}

	React.useEffect(() => {
		getAnalysis(meetingId);
	}, [meetingId]); // Fetch data when meetingId changes

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					className="text-xl p-5"
					variant="outline"
					onClick={() => {
						getAnalysis(meetingId);
					}}>
					Analysis
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full lg:max-w-screen-xl sm:px-10">
					{!isLoading ? (
						<>
							<DrawerHeader>
								<DrawerTitle className="flex justify-between items-center">
									<div className="text-3xl">
										{meetingType
											? "Meeting"
											: "Mock Interview"}
									</div>
									<div className="font-light">
										{meetingDetails?.dateAndTime &&
											DateTimeDisplay(
												meetingDetails.dateAndTime
											).slice(0, 17)}
									</div>
								</DrawerTitle>
								<DrawerDescription>
									Id: {meetingId.slice(9)}
									<div className="pt-2">
										Participants:
										<div>
											{meetingDetails?.users && (
												<div className="flex gap-3">
													{extractEmails(
														meetingDetails.users
													).map((user, id) => (
														<Badge
															variant="secondary"
															key={id}>
															{user}
														</Badge>
													))}
												</div>
											)}
										</div>
									</div>
									<div className="text-lg">
										<div className="pt-3  font-bold text-secondary-foreground">
											Description:
										</div>
										<div>{meetingDetails?.description}</div>
									</div>
								</DrawerDescription>
							</DrawerHeader>
							<div className="p-4 pb-0 ">
								<div className="flex gap-2 flex-col">
									<div>
										<div className="font-bold text-lg pb-2">
											Technical Skills:
										</div>
										<div>
											{analysis?.technical_skills.comment}
										</div>
										<div>
											{analysis?.technical_skills.rating}{" "}
											<RatingBar
												rating={
													analysis?.technical_skills
														.rating
												}></RatingBar>
										</div>
									</div>
									<div className="border my-2" />
									<div>
										<div className="font-bold text-lg pb-2">
											Communication Skills:
										</div>
										<div>
											{
												analysis?.communication_skills
													.comment
											}
										</div>
										<div>
											<div>
												{
													analysis
														?.communication_skills
														.rating
												}
											</div>
											<div>
												<RatingBar
													rating={
														analysis
															?.communication_skills
															.rating
													}></RatingBar>
											</div>
										</div>
									</div>
									<div className="border my-2" />
									<div>
										<div className="font-bold text-lg pb-2">
											Cultural Fit:
										</div>
										<div>
											{analysis?.cultural_fit.comment}
										</div>
										<div>
											{analysis?.cultural_fit.rating}{" "}
											<RatingBar
												rating={
													analysis?.cultural_fit
														.rating
												}></RatingBar>
										</div>
									</div>
									<div className="border my-2" />
									<div>
										<div className="font-bold text-lg pb-2">
											Overall Rating:
										</div>
										<div>
											{analysis?.overall_rating.comment}
										</div>
										<div>
											{analysis?.overall_rating.rating}{" "}
											<RatingBar
												rating={
													analysis?.overall_rating
														.rating
												}></RatingBar>
										</div>
									</div>
								</div>
							</div>
							<div className="flex justify-center ">
								<DrawerFooter>
									<DrawerClose asChild>
										<Button variant="outline">
											Cancel
										</Button>
									</DrawerClose>
								</DrawerFooter>
							</div>
						</>
					) : (
						<div className="h-56 flex justify-center items-center">
							<Image
								src="/icons/loading-circle.svg"
								alt="Loading..."
								width={50}
								height={50}
							/>
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
