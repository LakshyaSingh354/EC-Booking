"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function CreateEventPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
  ]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>([]);

  useEffect(() => {
    fetch("/next/api/consultants")
      .then((res) => res.json())
      .then((data) => setConsultants(data));
  }, []);

  const handleConsultantSelection = (id: string) => {
    setSelectedConsultants((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // if (!session?.user?.email) {
      // alert("You must be logged in to create an event.");
      // router.replace("/auth/signin");
      // return;
    // }
  
    const eventData = {
      title,
      description,
      duration,
      consultants: selectedConsultants,
      user: session?.user?.id ?? "67b075c879cc493b203d029c",
      price
    };
    console.log(eventData);
    const res = await fetch("/next/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    console.log(res);
    if (res.ok) {
      alert("Event created successfully!");
      router.push("http://localhost:8000/admin/myapp/services/");
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-28">
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
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-2 border rounded text-black"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded text-black"
          rows={4}
        />

        <h2 className="text-lg font-semibold">Select Consultants</h2>
        <div className="grid grid-cols-2 gap-4">
          {consultants.map((consultant) => (
            <div
              key={consultant._id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                selectedConsultants.includes(consultant._id)
                  ? "border-green-500 bg-green-100 text-black"
                  : "hover:shadow-md"
              }`}
              onClick={() => handleConsultantSelection(consultant._id)}
            >
              <img
                src={consultant.avatar || "/default-avatar.png"}
                alt={consultant.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">{consultant.name}</h3>
                <p className="text-xs text-gray-500">{consultant.expertise}</p>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}
