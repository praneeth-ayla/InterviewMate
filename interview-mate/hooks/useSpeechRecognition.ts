"use client";

import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

// Check for webkitSpeechRecognition support
let recognition: SpeechRecognition;
if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
	recognition = new (window as any).webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.lang = "en-US";
}

// Function to get the local audio stream
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
	const { useMicrophoneState } = useCallStateHooks();
	const { microphone } = useMicrophoneState();
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

		// Create an audio context and media stream source
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(stream);

		// Connect the audio source to the speech recognition
		const destination = audioContext.createMediaStreamDestination();
		source.connect(destination);

		const newStream = destination.stream;
		recognition.start();

		// Connect the audio stream to the recognition
		if (!isListening) {
			recognition.onaudiostart = () => {
				console.log("Audio capturing started");
			};
		}

		recognition.onaudioend = () => {
			console.log("Audio capturing ended");
			audioContext.close();
			microphone.toggle();
			if (isListening) {
				microphone.toggle();
				setTimeout(() => {
					microphone.toggle();
				}, 20);
			} else {
				microphone.toggle();
			}
		};
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
