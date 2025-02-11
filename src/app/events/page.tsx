"use client";

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

	useEffect(() => {
		fetch("/api/user")
		fetch("/api/consultants")
		fetch("/api/events")
			.then((res) => res.json())
			.then(setEvents);
	}, []);

	return (
		<div className="w-1/2 mx-auto mt-28">
			<h1 className="text-2xl font-bold">Available Events</h1>
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
									<Link href={`/book/${event._id}?consultantId=${consultant._id}`} key={consultant._id}>
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
