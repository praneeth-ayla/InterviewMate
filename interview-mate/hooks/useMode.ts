import { useState } from "react";

type Mode = "interviewer" | "interviewee";

export function useMode() {
	const [mode, setMode] = useState<Mode>("interviewer");
	return { mode, setMode };
}
