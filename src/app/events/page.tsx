"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Consultant {
	_id: string;
	name: string;
	avatar: string;
}

interface Event {
	_id: string;
	title: string;
	description?: string;
	duration: number;
	consultants: Consultant[];
}

export default function EventsPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const router = useRouter();

	const fetchWithRetry = async (retries = 5) => {
		const url = "/api/events";
		for (let i = 0; i < retries; i++) {
			try {
				fetch("/api/user");
				fetch("/api/consultants");
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
			.then(setEvents)
			.catch((error) => console.error(error));
	}, []);

	return (
		<div className="w-1/2 mx-auto mt-28">
			<h1 className="text-2xl font-bold">Available Events</h1>
			<button
				onClick={() => signOut({ callbackUrl: "/" })}
				className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
			>
				Logout
			</button>
			<ul className="mt-4 space-y-4">
				{events.map((event) => (
					<li
						key={event._id}
						className="p-4 rounded-xl bg-gray-800 px-4 space-x-8 flex justify-between items-center shadow-xl"
					>
						<div>
							<span className="text-xl font-bold">
								{event.title} ({event.duration} min)
							</span>
							<div className="mt-2 space-x-4 flex">
								{event.consultants.map((consultant) => (
									<Link
										href={`/book/${event._id}?consultantId=${consultant._id}`}
										key={consultant._id}
									>
										<div
											key={consultant._id}
											className="p-4 w-fit"
										>
											<img
												src={
													consultant.avatar ||
													"/default-avatar.png"
												}
												alt={consultant.name}
												className="w-16 h-16 rounded-full mx-auto mb-2"
											/>
											<h3 className="font-semibold">
												{consultant.name}
											</h3>
										</div>
									</Link>
								))}
							</div>
						</div>
						<button
							className="border-2 max-h-9 border-green-600 text-white px-4 py-1 rounded-lg"
							onClick={() => {
								router.push(`/events/${event._id}`);
							}}
						>
							View
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
