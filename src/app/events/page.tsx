"use client";

import { useEffect, useState } from "react";

interface Event {
  _id: string;
  title: string;
  duration: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold">Available Events</h1>
      <ul className="mt-4 space-y-2">
        {events.map((event) => (
          <li key={event._id} className="p-2 border rounded flex justify-between">
            <span>{event.title} ({event.duration} min)</span>
            <a href={`/book/${event._id}`} className="text-blue-500 underline">
              Book
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
