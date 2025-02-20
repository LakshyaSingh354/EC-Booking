"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Events";

export default function EventDetailsPage() {
	const router = useRouter();
	const { eventid } = useParams();
	const [event, setEvent] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const fetchWithRetry = async (retries = 5) => {
		const url = `/next/api/events/${eventid}`;
		for (let i = 0; i < retries; i++) {
			try {
				fetch("/next/api/user");
				fetch("/next/api/consultants");
				const response = await fetch(url);
				if (response.status === 500) {
					console.warn(`Retrying due to 500 error: Attempt ${i + 1}`);
					continue;
				}
				return await response.json(); // Break if no 500 error
			} catch (error) {
				console.error("Network error:", error);
			}
		}
		throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
	};

	useEffect(() => {
		fetchWithRetry()
			.then(setEvent)
      .catch((error) => console.error(error));
      setLoading(false);
	}, [eventid]);

	if (loading) return <p>Loading...</p>;
	if (!event) return <p>Loading...</p>;

	const handleBooking = (consultantId?: string) => {
		router.push(
			`/book/${eventid}${
				consultantId ? `?consultantId=${consultantId}` : ""
			}`
		);
	};

	return (
		<div className="max-w-2xl mx-auto mt-28 p-5">
			<h1 className="text-3xl font-bold">{event.title}</h1>
			<p className="text-gray-600">{event.description}</p>
			<p className="mt-2">
				<strong>Duration:</strong> {event.duration} mins
			</p>

			<h2 className="text-xl font-semibold mt-6">
				Available Consultants
			</h2>
			{event.consultants.length === 0 ? (
				<p>No consultants assigned to this event.</p>
			) : (
				<div className="grid grid-cols-2 gap-4 mt-4">
					{event.consultants.map((consultant: any) => (
						<div
							key={consultant._id}
							className="p-4 border rounded-lg shadow text-center"
						>
							<img
								src={consultant.avatar || "/default-avatar.png"}
								alt={consultant.name}
								className="w-16 h-16 rounded-full mx-auto mb-2"
							/>
							<h3 className="font-semibold">{consultant.name}</h3>
							<button
								onClick={() => handleBooking(consultant._id)}
								className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
							>
								Book {consultant.name}
							</button>
						</div>
					))}
				</div>
			)}

			{/* <button
        onClick={() => handleBooking()}
        className="mt-6 w-full px-4 py-2 bg-green-500 text-white rounded"
      >
        Not sure? Book without a consultant and we'll assign one for you
      </button> */}
		</div>
	);
}
