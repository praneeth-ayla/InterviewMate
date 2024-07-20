import { IconButton, useCallStateHooks } from "@stream-io/video-react-sdk";

export const ToggleAudioButton = () => {
	const { useMicrophoneState } = useCallStateHooks();
	const { microphone, isMute } = useMicrophoneState();
	return (
		<div className="bgblack text-black w-20 h-20 bg-white">
			<IconButton
				icon={isMute ? "mic-off" : "mic"}
				onClick={() => microphone.toggle()}
			/>
		</div>
	);
};

// const ToggleVideoButton = () => {
//   const { useCameraState } = useCallStateHooks();
//   const { camera, isMute } = useCameraState();
//   return (
//     <IconButton
//       icon={isMute ? 'camera-off' : 'camera'}
//       onClick={() => camera.toggle()}
//     />
//   );
// };
