"use client";
import { useState } from "react";
import {
	CallControls,
	CallParticipantsList,
	CallStatsButton,
	CallingState,
	PaginatedGridLayout,
	SpeakerLayout,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, LayoutList } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { cn } from "@/lib/utils";
import { ToggleAudioButton } from "./MicOn";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
	const searchParams = useSearchParams();
	const isPersonalRoom = !!searchParams.get("personal");
	const router = useRouter();
	const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
	const [showParticipants, setShowParticipants] = useState(false);
	const { useCallCallingState } = useCallStateHooks();

	// for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
	const callingState = useCallCallingState();

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
		<div>
			{CallLayout()}

			<div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
				{/* <CallControls onLeave={() => router.push(`/`)} /> */}
				<ToggleAudioButton></ToggleAudioButton>
				{!isPersonalRoom && <EndCallButton />}
			</div>
		</div>
	);
};
export default MeetingRoom;
