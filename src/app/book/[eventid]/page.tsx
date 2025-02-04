"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BookEventPage({
}: {
}) {
  const params = useParams();
	const eventId = params.eventid as string;
	const { data: session } = useSession();
	const router = useRouter();
	const [event, setEvent] = useState<{
		title: string;
		duration: number;
	} | null>(null);
	const [guestName, setGuestName] = useState("");
	const [guestEmail, setGuestEmail] = useState("");
	const [selectedTime, setSelectedTime] = useState("");



	useEffect(() => {
		fetch(`/api/events/${params.eventid}`)
			.then((res) => res.json())
			.then(setEvent);
	}, [params.eventid]);

	const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
		const startTime = new Date(selectedTime);
    console.log(`Event::${event!.title}`)
    console.log(`Event Duration::${event!.duration}`)
		const endTime = new Date(startTime.getTime() + event!.duration * 60000);
		const bookingData = {
			event: params.eventid,
			user: session?.user?.id,
			guestEmail,
			guestName,
			startTime,
			endTime,
		};
    console.log(bookingData);
		const res = await fetch(`/api/bookings`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(bookingData),
		});
		console.log(res);
		if (res.ok) {
			alert("Booking successful!");
			router.push("/bookings");
		} else {
			alert("Failed to book event");
		}
	};

	if (!event) return <p>Loading...</p>;

	return (
		<div className="max-w-lg mx-auto mt-10">
			<h1 className="text-2xl font-bold">Book {event.title}</h1>
			<form onSubmit={handleBooking} className="mt-4 space-y-4">
				<input
					type="text"
					placeholder="Your Name"
					value={guestName}
					onChange={(e) => setGuestName(e.target.value)}
					className="w-full p-2 border rounded text-black"
				/>
				<input
					type="email"
					placeholder="Your Email"
					value={guestEmail}
					onChange={(e) => setGuestEmail(e.target.value)}
					className="w-full p-2 border rounded text-black"
				/>
				<input
					type="datetime-local"
					value={selectedTime}
					onChange={(e) => setSelectedTime(e.target.value)}
					className="w-full p-2 border rounded text-black"
				/>
				<button
					type="submit"
					className="px-4 py-2 bg-green-500 text-white rounded"
				>
					Confirm Booking
				</button>
			</form>
		</div>
	);
}
