"use client";

import { useState, useEffect, useRef } from "react";

export default function useTranslator() {
	const [text, setText] = useState("");
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const isSpeakingRef = useRef(false);
	const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const silenceDelay = 2000; // Silence delay in milliseconds (2 seconds)
	const restartDelay = 500; // Restart delay in milliseconds (500 milliseconds)

	useEffect(() => {
		if (typeof window !== "undefined") {
			const SpeechRecognition =
				window.SpeechRecognition || window.webkitSpeechRecognition;
			if (!SpeechRecognition) {
				alert("Your browser doesn't support SpeechRecognition.");
				return;
			}

			const recognition = new SpeechRecognition();
			recognition.lang = "en-US";
			recognition.interimResults = true;
			recognition.continuous = true;

			recognition.onresult = (event) => {
				let finalTranscript = "";
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						finalTranscript += transcript + " ";
					}
				}
				if (finalTranscript) {
					setText((prevText) => prevText + finalTranscript);
				}
				isSpeakingRef.current = true;
				resetSilenceTimeout();
				console.log("Speaking...");
			};

			recognition.onspeechend = () => {
				isSpeakingRef.current = false;
				console.log("Speech ended...");
				resetSilenceTimeout();
			};

			recognition.onspeechstart = () => {
				isSpeakingRef.current = true;
				console.log("Speech started...");
				resetSilenceTimeout();
			};

			recognition.onerror = (event) => {
				console.error("Speech recognition error", event.error);
				if (event.error === "no-speech") {
					stopRecognition();
				} else {
					restartRecognition();
				}
			};

			recognition.onend = () => {
				console.log("Recognition ended...");
				if (!isSpeakingRef.current) {
					restartRecognition();
				}
			};

			const startRecognition = () => {
				if (recognitionRef.current && recognitionRef.current.start) {
					recognitionRef.current.start();
					console.log("Recognition started...");
				}
			};

			const stopRecognition = () => {
				if (recognitionRef.current && recognitionRef.current.stop) {
					recognitionRef.current.stop();
					console.log("Recognition stopped...");
				}
			};

			const restartRecognition = () => {
				stopRecognition();
				setTimeout(() => {
					startRecognition();
				}, restartDelay); // Adjusted to 500 milliseconds
			};

			const resetSilenceTimeout = () => {
				if (silenceTimeoutRef.current) {
					clearTimeout(silenceTimeoutRef.current);
				}
				silenceTimeoutRef.current = setTimeout(() => {
					if (!isSpeakingRef.current) {
						stopRecognition();
					}
				}, silenceDelay);
			};

			recognitionRef.current = recognition;
			startRecognition();

			// Cleanup on component unmount
			return () => {
				if (recognitionRef.current) {
					recognitionRef.current.abort();
				}
				if (silenceTimeoutRef.current) {
					clearTimeout(silenceTimeoutRef.current);
				}
			};
		}
	}, []);

	return { text };
}
