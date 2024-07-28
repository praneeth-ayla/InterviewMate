import { AccordionLanding } from "@/components/Accordion";
import Footer from "@/components/Footer";
import { ModeToggle } from "@/components/mode-toggle";
import TableLanding from "@/components/TableLanding";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { GridBackground } from "@/components/ui/grid";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { HomeIcon, UserIcon } from "lucide-react";
import React from "react";

export default function page() {
	return (
		<div>
			<FloatingNav
				navItems={[
					{
						name: "Home",
						link: "/home",
						icon: <HomeIcon />,
					},
				]}
			/>
			<GridBackground />
			<MacbookScroll src="/landing/home.png" />
			<div className="md:h-96 "></div>
			<div className="md:pt-96 md:mt-20 -mt-96 px-4 sm:px-10 md:px-32 lg:px-80 xl:px-96">
				<div id="whyChooseUs">
					<TableLanding />
				</div>
				<div
					id="questions"
					className="mt-20 sm:mt-20 md:mt-40">
					<AccordionLanding />
				</div>
			</div>
			<Footer />
		</div>
	);
}
