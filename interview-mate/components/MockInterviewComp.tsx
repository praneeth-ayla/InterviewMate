"use client";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import PreviousQuestions from "./PreviousQuestions";
import Image from "next/image";
import useSpeechRecognition from "@/hooks/UseSpeechMock";

export default function MockInterviewComp() {
	const mockId = usePathname();
	const [mockDetails, setMockDetails] = useState<any>();
	const [questions, setQuestions] = useState<string[]>([]); // Use an array
	const { needQuestions } = useSendSpeech();
	const [loading, setLoading] = useState(false);
	const [previousQuestions, setPreviousQuestions] = useState<string[]>([]); // Use an array
	const [count, setCount] = useState(0);
	const router = useRouter();
	const [isMuted, setIsMuted] = useState(false);

	const {
		hasRecognitionSupport,
		isListening,
		startListening,
		stopListening,
		text,
		setText,
	} = useSpeechRecognition(isMuted);
	const { sendWS } = useSendSpeech();

	function handleWhenEmpty() {
		startListening();
		console.warn("started listening");
		setLoading(true);
		needQuestions(mockId, "empty")
			.then((questions) => {
				const questionArray = Object.values(questions);
				setQuestions(questionArray);
				setLoading(false);
				setTimeout(() => {
					speak(questions[count + 1]);
				}, 200);
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
		setIsMuted((prev) => !prev);
		setIsMuted((prev) => !prev);

		sendWS({
			text: questions[count],
			role: "interviwer",
			meetingRoomId: mockId,
		});
		setTimeout(() => {
			sendWS({ text, role: "interviwee", meetingRoomId: mockId });
		}, 1000);
		setText("");
		if (count === 4) {
			handleQuestionReq();
		} else {
			// Append new questions to previousQuestions
			setCount((c) => c + 1);
		}
		setPreviousQuestions((prev) => [...prev, questions[count]]);

		setTimeout(() => {
			speak(questions[count + 1]);
		}, 400);
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
		} catch (error) {
			console.error("Fetch error:", error);
		}
	}

	useEffect(() => {
		if (!hasRecognitionSupport) {
			alert("Speech recognition is not supported in this browser.");
		}
		if (text !== "") {
			setInterval(() => {
				startListening();
			}, 100);
		}
		getMockDetails();
	}, []);

	function speak(question: string) {
		// Create a SpeechSynthesisUtterance
		const utterance = new SpeechSynthesisUtterance(question);

		// Select a voice
		const voices = speechSynthesis.getVoices();
		utterance.voice = voices[3]; // Choose a specific voice

		// Speak the text
		speechSynthesis.speak(utterance);
	}

	return (
		<div className="pt-20 px-10 sm:px-20 md:px-40 lg:px-20 xl:px-60 flex flex-col justify-between h-screen">
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
					<div className="flex justify-center items-center w-full lg:w-2/3 rounded-lg">
						<Image
							alt="bot image"
							src="/images/bot.png"
							height={300}
							width={300}></Image>
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
						<div
							onClick={() => {
								speak(questions[count]);
							}}
							className="hover:cursor-pointer">
							{questions[count]}
						</div>
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
			<div className="flex justify-center mt-10 pb-3 space-x-4">
				<Button
					className="bg-red-500 text-white px-4 py-2"
					onClick={() => {
						router.push("/home");
						stopListening();
					}}>
					End Interview
				</Button>
			</div>
		</div>
	);
}
