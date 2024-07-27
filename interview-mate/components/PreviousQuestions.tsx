export default function PreviousQuestions({
	previousQuestions,
}: {
	previousQuestions: any[];
}) {
	return (
		<div className="overflow-auto h-80 p-4 border bg-card rounded shadow-md">
			{previousQuestions.length > 0 ? (
				previousQuestions.map((question: any, id: number) => (
					<div
						key={id}
						className="p-2 border-b last:border-b-0">
						{question}
					</div>
				))
			) : (
				<div className="text-muted-foreground flex justify-center items-center h-full">
					No previous questions.
				</div>
			)}
		</div>
	);
}
