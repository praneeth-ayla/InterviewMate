import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";

import MobileNav from "./MobileNav";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useMode } from "@/hooks/useMode";

const Navbar = () => {
	const { mode, setMode } = useMode();
	return (
		<nav className=" flex  justify-between  fixed z-50 w-full bg-white dark:bg-black border-b  px-6 py-4 lg:px-10">
			<Link
				href="/"
				className="flex items-center gap-1">
				<Image
					src="/icons/logo.svg"
					width={32}
					height={32}
					alt="interview mate logo"
					className="max-sm:size-10"
				/>
				<p className="text-[26px] font-extrabold  max-sm:hidden">
					INTERVIEW MATE
				</p>
			</Link>
			<div className="flex justify-between gap-5">
				<div>
					<Button
						onClick={() => {
							setMode((prevMode) =>
								prevMode === "interviewer"
									? "interviewee"
									: "interviewer"
							);
						}}>
						Switch to{" "}
						{mode === "interviewee" ? "Interviwer" : "Interviwee"}
					</Button>
				</div>
				<div>
					<ModeToggle></ModeToggle>
				</div>
				<SignedIn>
					<UserButton afterSignOutUrl="/sign-in" />
				</SignedIn>
				<MobileNav />
			</div>
		</nav>
	);
};

export default Navbar;
