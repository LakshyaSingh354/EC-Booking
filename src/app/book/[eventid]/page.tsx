"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BookEventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const eventId = params.eventid as string;
  const consultantId = searchParams.get("consultantId") as string | undefined;

  const [event, setEvent] = useState<{ title: string; duration: number; price: number } | null>(null);
  const [consultant, setConsultant] = useState<{ name: string; avatar: string } | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetch(`/next/api/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvent);

    if (consultantId) {
      fetch(`/next/api/consultants/${consultantId}`)
        .then((res) => res.json())
        .then(setConsultant);
    }

    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
  }, [eventId, consultantId]);

  const initiatePayment = async () => {
    setPaymentLoading(true);

    const startTime = new Date(selectedTime);
    const endTime = new Date(startTime.getTime() + event!.duration * 60000);

    const bookingData = {
      event: eventId,
      consultant: consultantId || null,
      user: session?.user?.id,
      guestEmail,
      guestName,
      startTime,
      endTime,
    };
    // Create a Razorpay order
    const paymentRes = await fetch("/next/api/payment/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: eventId, amount: event!.price }),
    });

    const paymentData = await paymentRes.json();
    if (paymentData.error) {
      alert("Error creating payment order");
      setPaymentLoading(false);
      return;
    }

    // Ensure Razorpay script is loaded before calling it
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK failed to load. Please try again.");
      setPaymentLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay Key ID
      amount: paymentData.amount,
      currency: "INR",
      name: "Epitome Consulting",
      description: `Booking for ${event!.title}`,
      order_id: paymentData.id,
      handler: async (response: any) => {
        const bookingDataWithPayment = { ...bookingData, paymentId: response.razorpay_payment_id };

        const bookingRes = await fetch("/next/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingDataWithPayment),
        });

        if (bookingRes.ok) {
          alert("Booking successful!");
          router.push("/");
        } else {
          alert("Booking failed");
        }
        setPaymentLoading(false);
      },
      prefill: { name: guestName, email: guestEmail },
      theme: { color: "#00cc66" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    initiatePayment();
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold">Book {event.title}</h1>

      {consultant ? (
        <div className="flex items-center p-4 border rounded-lg shadow my-4">
          <img src={consultant.avatar || "/default-avatar.png"} alt={consultant.name} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <p className="font-semibold">{consultant.name}</p>
            <button onClick={() => router.push(`/events/${eventId}`)} className="text-blue-500 text-sm">
              Change Consultant
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No consultant selected.</p>
      )}

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
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded w-full" disabled={paymentLoading}>
          {paymentLoading ? "Processing Payment..." : `Pay ₹${event.price} & Confirm Booking`}
        </button>
      </form>
    </div>
  );
}
