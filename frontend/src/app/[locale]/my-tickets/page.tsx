"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import type { Ticket } from "@/types";

export default function MyTicketsPage() {
    const t = useTranslations("myTickets");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState<Ticket[] | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email.trim()) return;

        setLoading(true);

        try {
            const result = await api.tickets.mine(email);
            setTickets(result);
        } catch {
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-lg mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-zinc-900 mb-6">
                {t("title")}
            </h1>
			
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                    {loading ? t("searching") : t("search")}
                </button>
            </form>

            {tickets !== null && (
                <div className="mt-6 space-y-3">
                    {tickets.length === 0 ? (
                        <p className="text-zinc-500">{t("empty")}</p>
                    ) : (
                        tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="rounded-xl border border-zinc-200 p-4"
                            >
                                <p className="font-semibold text-zinc-900">
                                    {ticket.event.title}
                                </p>
                                <p className="text-sm text-zinc-500">
                                    {ticket.event.city}
                                </p>
                                <p className="mt-2 text-xs text-zinc-400">
                                    {t(`status.${ticket.status}`)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
