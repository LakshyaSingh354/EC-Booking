"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConsultantsPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<any[]>([]);

  useEffect(() => {
    fetch("/next/api/consultants")
      .then((res) => res.json())
      .then((data) => setConsultants(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-28 p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Consultants</h1>
        <button
          onClick={() => router.push("/consultants/new")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Consultant
        </button>
      </div>

      {consultants.length === 0 ? (
        <p>No consultants available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {consultants.map((consultant) => (
            <div key={consultant._id} className="p-4 border rounded-lg shadow">
              <img
                src={consultant.avatar || "/default-avatar.png"}
                alt={consultant.name}
                className="w-20 h-20 rounded-full mx-auto mb-2"
              />
              <h3 className="text-lg font-semibold text-center">{consultant.name}</h3>
              <p className="text-sm text-gray-500 text-center">{consultant.expertise}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
