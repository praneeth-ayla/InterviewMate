"use client";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function page() {
	const mockId = usePathname();
	const { joinRoom } = useSendSpeech();
	const { user } = useUser();
	function getUserMail() {
		if (user?.emailAddresses[0].emailAddress) {
			return user?.emailAddresses[0].emailAddress;
		}
		return "";
	}

	useEffect(() => {
		joinRoom(mockId, getUserMail());
	});
	return (
		<div className="p-20">
			test mock interview
			<div>{mockId}</div>
		</div>
	);
}
