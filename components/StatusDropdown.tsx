"use client";

export default function StatusDropdown({
  patientId,
  currentStatus,
}: {
  patientId: number;
  currentStatus: string;
}) {
  const updateStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const status = e.target.value;

    await fetch("/api/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: patientId,
        status,
      }),
    });

    window.location.reload();
  };

  return (
    <select
      defaultValue={currentStatus || "New"}
      onChange={updateStatus}
      className="border rounded-lg px-3 py-2"
    >
      <option>New</option>
      <option>Contacted</option>
      <option>Documents Received</option>
      <option>Hospital Shared</option>
      <option>Quotation Sent</option>
      <option>Treatment Booked</option>
      <option>Converted</option>
      <option>Closed</option>
    </select>
  );
}