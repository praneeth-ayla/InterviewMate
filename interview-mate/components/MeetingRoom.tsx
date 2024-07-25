"use client";
import { useEffect, useState } from "react";
import {
	CallControls,
	CallParticipantsList,
	CallingState,
	PaginatedGridLayout,
	SpeakerLayout,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Users, LayoutList } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton, { isMeetingOwner } from "./EndCallButton";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

import { useSendSpeech } from "@/hooks/useSendSpeech";
import QuestionsDropdown from "./QuestionsDropdown";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
	const searchParams = useSearchParams();
	const isPersonalRoom = !!searchParams.get("personal");
	const router = useRouter();
	const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
	const [showParticipants, setShowParticipants] = useState(false);
	const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
	const { isMute } = useMicrophoneState();
	const { sendWS, needQuestions } = useSendSpeech();
	const meetingRoomId = usePathname();
	const [questions, setQuestions] = useState<any>();

	const role = isMeetingOwner ? "interviewer" : "inteviewee";

	const callingState = useCallCallingState();

	const {
		text,
		startListening,
		stopListening,
		hasRecognitionSupport,
		isListening,
	} = useSpeechRecognition();

	useEffect(() => {
		if (!isPersonalRoom && !isMute) {
			if (!isListening) {
				startListening();
				if (text !== "") {
					sendWS({ text, role, meetingRoomId });
					console.log({ text, role });
				}
			}
		}
	}, [isPersonalRoom, isMute, isListening, startListening, text]);

	useEffect(() => {
		if (!hasRecognitionSupport) {
			console.warn(
				"Speech recognition is not supported in this browser."
			);
		}
		return () => {
			if (isListening) {
				stopListening();
			}
		};
	}, [hasRecognitionSupport, isListening, stopListening]);

	if (callingState !== CallingState.JOINED) return <Loader />;

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout />;
			case "speaker-right":
				return <SpeakerLayout participantsBarPosition="left" />;
			default:
				return <SpeakerLayout participantsBarPosition="right" />;
		}
	};

	return (
		<section className="relative h-screen w-full bg-black text-white overflow-hidden pt-4">
			<div className="relative flex size-full items-center justify-center">
				<div className="flex size-full max-w-[1000px] items-center text-white">
					<CallLayout />
				</div>
				<div
					className={`h-[calc(100vh-86px)] ${
						showParticipants ? "" : "hidden"
					} ml-2 `}>
					<CallParticipantsList
						onClose={() => setShowParticipants(false)}
					/>
				</div>
			</div>
			{/* video layout and call controls */}
			<div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
				<CallControls onLeave={() => router.push(`/`)} />
				<DropdownMenu>
					<div className="flex items-center">
						<DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-black px-4 py-2 hover:bg-[#4c535b]">
							<LayoutList
								size={20}
								className="text-white"
							/>
						</DropdownMenuTrigger>
					</div>
					<DropdownMenuContent className="border bg-black text-white">
						{["Grid", "Speaker-Left", "Speaker-Right"].map(
							(item, index) => (
								<div key={index}>
									<DropdownMenuItem
										onClick={() =>
											setLayout(
												item.toLowerCase() as CallLayoutType
											)
										}>
										{item}
									</DropdownMenuItem>
									<DropdownMenuSeparator className="border-dark-1" />
								</div>
							)
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				{!isPersonalRoom && isMeetingOwner && (
					<QuestionsDropdown
						meetingRoomId={meetingRoomId}></QuestionsDropdown>
				)}
				<button onClick={() => setShowParticipants((prev) => !prev)}>
					<div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
						<Users
							size={20}
							className="text-white"
						/>
					</div>
				</button>
				{!isPersonalRoom && <EndCallButton />}
			</div>
		</section>
	);
};

export default MeetingRoom;
