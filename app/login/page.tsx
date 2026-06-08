"use client";

import { useState } from "react";

export default function Login() {
  const [password, setPassword] =
    useState("");

  const login = () => {
    if (password === "healwithindia") {
      document.cookie =
        "admin=healwithindia";
      window.location.href = "/admin";
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h1 className="text-3xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-4"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="w-full bg-slate-900 text-white p-4 rounded-xl"
        >
          Login
        </button>

      </div>

    </div>
  );
}