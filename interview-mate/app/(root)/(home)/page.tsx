import MeetingTypeList from "@/components/MeetingTypeList";
import SwitchMode from "@/components/SwitchMode";

const Home = () => {
	const now = new Date();

	const time = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
	const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
		now
	);

	return (
		<section className="flex size-full flex-col gap-5 ">
			<div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
				<div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
					<h2 className=" max-w-[273px] bg-green-950   text-center text-xl rounded-sm font-bold">
						<div className="py-2 glassmorphism ">Join now</div>
					</h2>
					<div className="flex flex-col gap-2 text-black ">
						<h1 className="text-4xl font-extrabold lg:text-7xl">
							{time}
						</h1>
						<p className="text-lg font-medium text-sky-1 lg:text-2xl">
							{date}
						</p>
					</div>
				</div>
			</div>

			<MeetingTypeList />
		</section>
	);
};

export default Home;
