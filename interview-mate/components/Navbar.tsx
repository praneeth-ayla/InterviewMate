import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";

import MobileNav from "./MobileNav";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
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
					Interview Mate
				</p>
			</Link>
			<div className="flex justify-between gap-5">
				<div></div>
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
