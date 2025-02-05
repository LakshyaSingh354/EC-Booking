"use client";

import { useState } from "react";

export default function AddConsultantPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const consultantData = { name, email, expertise, avatar };

    const res = await fetch("/api/consultants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consultantData),
    });

    if (res.ok) {
      alert("Consultant added successfully!");
      window.location.href = "/consultants";
      setName("");
      setEmail("");
      setExpertise("");
      setAvatar("");
    } else {
      alert("Failed to add consultant.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 p-5 border rounded text-black-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Add Consultant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
        {/* <input
          type="text"
          placeholder="Expertise"
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        /> */}
        <input
          type="text"
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
        {avatar && (
          <img src={avatar} alt="Avatar Preview" className="w-20 h-20 rounded text-black-full mx-auto" />
        )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Consultant
        </button>
      </form>
    </div>
  );
}
