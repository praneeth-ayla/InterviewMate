export default function page({ params }: { params: { id: string } }) {
	return <div>meeting id= #{params.id}</div>;
}
