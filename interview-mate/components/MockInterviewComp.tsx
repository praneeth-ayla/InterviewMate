"use client";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import QuestionsDropdown from "./QuestionsDropdown";
import { Button } from "./ui/button";
import PreviousQuestions from "./PreviousQuestions";
import Image from "next/image";

export default function MockInterviewComp() {
	const mockId = usePathname();
	const { joinRoom } = useSendSpeech();
	const { user } = useUser();
	const [mockDetails, setMockDetails] = useState<any>();
	const [questions, setQuestions] = useState<string[]>([]); // Use an array
	const { needQuestions } = useSendSpeech();
	const [loading, setLoading] = useState(false);
	const [previousQuestions, setPreviousQuestions] = useState<string[]>([]); // Use an array
	const [count, setCount] = useState(0);

	function getUserMail() {
		if (user?.emailAddresses[0]?.emailAddress) {
			return user.emailAddresses[0].emailAddress;
		}
		return "";
	}

	async function getMockDetails() {
		try {
			const response = await fetch(
				`https://interviewmate-atie.onrender.com/meetingD`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ meetingRoomId: mockId }),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setMockDetails(data.meetingDetails);
			console.log(data);
		} catch (error) {
			console.error("Fetch error:", error);
		}
	}

	useEffect(() => {
		joinRoom(mockId, getUserMail());
		getMockDetails();
	}, []);

	function handleWhenEmpty() {
		setLoading(true);
		needQuestions(mockId, "empty")
			.then((questions) => {
				const questionArray = Object.values(questions);
				setQuestions(questionArray);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching questions:", error);
				setLoading(false);
			});
	}

	function handleQuestionReq() {
		setLoading(true);
		needQuestions(mockId, "not")
			.then((questions) => {
				const questionArray = Object.values(questions);
				setQuestions(questionArray);
				setLoading(false);
				setCount(0);
			})
			.catch((error) => {
				console.error("Error fetching questions:", error);
				setLoading(false);
			});
	}

	function handleNext() {
		if (count === 4) {
			handleQuestionReq();
		} else {
			// Append new questions to previousQuestions
			setCount((c) => c + 1);
		}
		setPreviousQuestions((prev) => [...prev, questions[count]]);
	}
	return (
		<div className="pt-16 px-10 sm:px-20 md:px-40 lg:px-60 flex flex-col justify-between h-screen">
			<div>
				<div className="text-4xl font-bold pb-1">Mock Interview</div>
				<div>
					Id:{" "}
					<span className="text-muted-foreground">
						{mockId.slice(16)}
					</span>
				</div>
				<div
					className="text-lg mt-5"
					title={mockDetails?.description}>
					<span className="font-bold">Description:</span>{" "}
					{mockDetails?.description.length > 100 ? (
						<>{mockDetails?.description.slice(0, 100)}...</>
					) : (
						<>{mockDetails?.description}</>
					)}
				</div>
				<div className="flex h-96 lg:gap-10 lg:justify-between mt-5">
					<div className="bg-green-500 w-full lg:w-2/3 rounded-lg">
						bot
					</div>
					<div className="hidden lg:block w-1/3 h-80 rounded-lg">
						<div className="font-bold mb-2">Previous Questions</div>
						<PreviousQuestions
							previousQuestions={previousQuestions}
						/>
					</div>
				</div>
				<div className="flex justify-between gap-4 mt-10">
					<div>
						<div className="font-bold">Question:</div>
						<div>{questions[count]}</div>
					</div>
					<Button
						disabled={loading}
						className={loading ? "px-10" : ""}
						onClick={() => {
							{
								questions.length === 0
									? handleWhenEmpty()
									: handleNext();
							}
							console.log(questions);
						}}>
						{!loading ? (
							<>
								{questions.length === 0
									? "Generate Question"
									: "Next Question"}
							</>
						) : (
							<Image
								src="/icons/loading-circle.svg"
								alt="Loading..."
								width={35}
								height={35}
							/>
						)}
					</Button>
				</div>
			</div>
			<div className="flex justify-center mb-4 space-x-4">
				<Button className="bg-blue-500 text-white px-4 py-2">
					Mute
				</Button>
				<Button className="bg-red-500 text-white px-4 py-2 ">
					End Interview
				</Button>
			</div>
		</div>
	);
}
