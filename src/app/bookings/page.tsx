"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Assuming you're using NextAuth for Google auth

interface Booking {
  _id: string;
  event: {
    title: string;
  };
  guestName: string;
  startTime: string;
  endTime: string;
}

export default function BookingsPage() {
  const { data: session } = useSession(); // Get user session (authentication)
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch(`/api/bookings?user=${session.user?.email}`)
      .then((res) => res.json())
      .then(setBookings);
  }, [session]);

  if (!session) return <p>Please log in to view your bookings.</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <ul className="mt-4 space-y-2">
        {bookings.map((booking) => (
          <li key={booking._id} className="p-2 border rounded">
            <div>
              <strong>{booking.event.title}</strong>
            </div>
            <div>Guest: {booking.guestName}</div>
            <div>
              {new Date(booking.startTime).toLocaleString()} -{" "}
              {new Date(booking.endTime).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
