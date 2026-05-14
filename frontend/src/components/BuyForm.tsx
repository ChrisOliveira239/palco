"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

export function BuyForm({
    eventId,
    locale,
}: {
    eventId: string;
    locale: string;
}) {
    const t = useTranslations("event");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email.trim()) {
            setError(t("errorRequired"));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.tickets.buy({ eventId, buyerEmail: email });
            setSuccess(true);
        } catch(err) {
            setError(t("errorGeneric"));
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {t("success")}
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-zinc-700">
                {t("emailLabel")}
            </label>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
                {loading ? t("buying") : t("buy")}
            </button>
        </form>
    );
}
