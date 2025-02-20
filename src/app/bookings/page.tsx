"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Consultant {
  name: string;
  email: string;
  avatar: string;
}

interface Event {
  title: string;
}

interface Booking {
  _id: string;
  event: Event;
  consultant: Consultant;
  guestName: string;
  startTime: string;
  endTime: string;
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch(`/next/api/bookings?user=${session.user?.email}`)
      .then((res) => res.json())
      .then(setBookings);
  }, [session]);

  if (!session) return <p>Please log in to view your bookings.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-28">
      <h1 className="text-3xl font-bold text-center">My Bookings</h1>
      <ul className="mt-8 space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking._id}
            className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8"
          >
            {/* Event and Booking Details */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{booking.event.title}</h3>
              <div className="text-gray-300">Guest: {booking.guestName}</div>
              <div className="text-gray-400">
                {new Date(booking.startTime).toLocaleString()} to{" "}
                {new Date(booking.endTime).toLocaleString()}
              </div>
            </div>

            {/* Consultant Info */}
            <div className="flex items-center space-x-4">
              <img
                src={booking.consultant.avatar || "/default-avatar.png"}
                alt={booking.consultant.name}
                className="w-12 h-12 rounded-full border-2 border-gray-700"
              />
              <div>
                <p className="text-white font-semibold">{booking.consultant.name}</p>
                <p className="text-sm text-gray-400">{booking.consultant.email}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
