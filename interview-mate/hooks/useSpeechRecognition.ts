"use client";

import { useEffect, useState } from "react";

let recognition: SpeechRecognition;
if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
	recognition = new (window as any).webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.lang = "en-US";
}

async function getLocalAudioStream(): Promise<MediaStream | null> {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		return stream;
	} catch (error) {
		console.error("Error accessing local audio stream:", error);
		return null;
	}
}

export default function useSpeechRecognition() {
	const [text, setText] = useState<string>("");
	const [isListening, setIsListening] = useState<boolean>(false);

	useEffect(() => {
		if (!recognition) return;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = Array.from(event.results)
				.map((result) => result[0].transcript)
				.join("");
			setText(transcript);
			recognition.stop();

			setIsListening(false);
		};
	}, []);

	const startListening = async () => {
		setText("");
		setIsListening(true);

		const stream = await getLocalAudioStream();
		if (!stream) return;

		// Connect the audio stream to the recognition
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(stream);
		const processor = audioContext.createScriptProcessor(2048, 1, 1);

		source.connect(processor);
		processor.connect(audioContext.destination);

		processor.onaudioprocess = () => {
			// Handle audio processing if needed
		};

		recognition.start();
	};

	const stopListening = () => {
		setIsListening(false);
		recognition.stop();
	};

	return {
		text,
		isListening,
		startListening,
		stopListening,
		hasRecognitionSupport: !!recognition,
	};
}
