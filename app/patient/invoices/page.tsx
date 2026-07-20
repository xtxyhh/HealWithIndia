"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle2, DollarSign, Lock } from "lucide-react";

function PatientInvoicesContent() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetch("/api/patient/invoices");
        if (res.ok) {
          const json = await res.json();
          setInvoices(json.invoices || []);
          setQuotes(json.quotes || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const handlePayInvoice = async (invoiceId: string, amountUsd: number) => {
    setProcessingId(invoiceId);
    setMsg("");
    try {
      const txnRef = `TXN-${Date.now()}`;
      const res = await fetch("/api/patient/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: invoiceId,
          amount_usd: amountUsd,
          payment_method: "card",
          transaction_ref: txnRef
        })
      });
      if (res.ok) {
        setMsg("Payment completed successfully!");
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: "paid" } : inv));
      }
    } catch (e) {
      setMsg("Payment failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">Quotes & Proforma Invoices</h1>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">Transparent Medical Pricing</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        {msg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            {msg}
          </div>
        )}

        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Your Proforma Invoices</h2>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">{inv.invoice_number}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        inv.status === "paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Due Date: {new Date(inv.due_date).toLocaleDateString()}</p>
                    <p className="text-xl font-extrabold text-white mt-2">${inv.total_usd?.toLocaleString()} USD</p>
                  </div>
                  {inv.status !== "paid" && (
                    <button
                      onClick={() => handlePayInvoice(inv.id, inv.total_usd)}
                      disabled={processingId === inv.id}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2"
                    >
                      <Lock size={14} />
                      {processingId === inv.id ? "Processing..." : "Pay Securely Online"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No invoices generated yet. Your medical coordinator will issue an official quote after reviewing your medical reports.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientInvoicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Invoices...</div>}>
      <PatientInvoicesContent />
    </Suspense>
  );
}
