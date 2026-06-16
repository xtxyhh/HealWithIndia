"use client";

import { useState } from "react";

export default function CostCalculator() {
  const data = {
    Cardiology: {
      india: 7000,
      abroad: 120000,
    },
    Orthopedics: {
      india: 5000,
      abroad: 45000,
    },
    Oncology: {
      india: 10000,
      abroad: 60000,
    },
    IVF: {
      india: 3000,
      abroad: 15000,
    },
    "Kidney Transplant": {
      india: 12000,
      abroad: 250000,
    },
    "Liver Transplant": {
      india: 30000,
      abroad: 200000,
    },
  };

  const [treatment, setTreatment] =
    useState("Cardiology");

  const selected =
    data[treatment as keyof typeof data];

  const savings =
    selected.abroad - selected.india;

  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-5xl mx-auto px-4">

        <div className="text-center mb-12">

          <h2 className="text-5xl font-bold">
            Treatment Cost Calculator
          </h2>

          <p className="text-slate-600 mt-4">
            See how much you could save by
            choosing treatment in India.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <select
            value={treatment}
            onChange={(e) =>
              setTreatment(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          >
            {Object.keys(data).map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="grid md:grid-cols-3 gap-8 mt-10">

            <div className="bg-blue-50 p-8 rounded-2xl">

              <h3 className="font-bold">
                India Cost
              </h3>

              <p className="text-4xl font-bold text-blue-600 mt-4">
                ${selected.india.toLocaleString()}
              </p>

            </div>

            <div className="bg-red-50 p-8 rounded-2xl">

              <h3 className="font-bold">
                US / UK Cost
              </h3>

              <p className="text-4xl font-bold text-red-600 mt-4">
                ${selected.abroad.toLocaleString()}
              </p>

            </div>

            <div className="bg-green-50 p-8 rounded-2xl">

              <h3 className="font-bold">
                Potential Savings
              </h3>

              <p className="text-4xl font-bold text-green-600 mt-4">
                ${savings.toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}