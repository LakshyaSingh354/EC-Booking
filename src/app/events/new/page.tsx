"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session } = useSession(); // Move hook to top level
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!session?.user?.email) {
      alert("You must be logged in to create an event.");
      return;
    }
  
    const eventData = {
      title,
      duration,
      availability,
      user: session.user.id,
    };
  
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
  
    if (res.ok) {
      alert("Event created successfully!");
      router.push("/events");
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold">Create Event</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded text-black"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}