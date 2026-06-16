"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import {

  Lock,

  Mail,

  ShieldCheck,

} from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");

  const handleLogin = async () => {

    setError("");

    if(!email || !password){

      setError("Please enter email and password.");

      return;

    }

    setLoading(true);

    const {

      error,

    } = await supabase.auth.signInWithPassword({

      email,

      password,

    });

    setLoading(false);

    if(error){

      setError(error.message);

      return;

    }

    router.push("/admin");

    router.refresh();

  };

  return (

    <main className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4">

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[150px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[150px] rounded-full" />

      <div className="relative w-full max-w-md">

        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-10 shadow-2xl">

          <div className="flex justify-center">

            <div className="bg-blue-600/15 p-5 rounded-3xl">

              <ShieldCheck

                size={42}

                className="text-blue-400"

              />

            </div>

          </div>

          <h1 className="text-4xl font-bold text-white text-center mt-8">

            Admin Login

          </h1>

          <p className="text-slate-400 text-center mt-3">

            Sign in to HealWithIndia Dashboard

          </p>

          <div className="space-y-5 mt-10">

            <div className="relative">

              <Mail

                size={18}

                className="absolute left-5 top-5 text-slate-500"

              />

              <input

                type="email"

                placeholder="Email Address"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

                onKeyDown={(e)=>{

                  if(e.key==="Enter")

                  handleLogin();

                }}

                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-blue-500"

              />

            </div>

            <div className="relative">

              <Lock

                size={18}

                className="absolute left-5 top-5 text-slate-500"

              />

              <input

                type="password"

                placeholder="Password"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

                onKeyDown={(e)=>{

                  if(e.key==="Enter")

                  handleLogin();

                }}

                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-blue-500"

              />

            </div>

            {

              error &&

              <div className="text-red-400 text-sm">

                {error}

              </div>

            }

            <button

              onClick={handleLogin}

              disabled={loading}

              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-semibold transition"

            >

              {

                loading

                ?

                "Signing In..."

                :

                "Login"

              }

            </button>

          </div>

        </div>

      </div>

    </main>

  );

}