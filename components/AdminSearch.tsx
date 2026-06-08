"use client";

import { useState } from "react";

export default function AdminSearch({
  patients,
}: {
  patients: any[];
}) {
  const [query, setQuery] = useState("");

  const filtered = patients.filter((p) =>
    `${p.full_name} ${p.email} ${p.country} ${p.treatment}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search patients..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-4 rounded-xl mb-6"
      />

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} result(s)
      </p>
    </>
  );
}