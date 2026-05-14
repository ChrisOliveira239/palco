import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import { BuyForm } from "@/components/BuyForm";

function formatPrice(price: string, locale: string) {
    const n = Number(price);

    if (n === 0) return locale === "pt" ? "Gratuito" : "Free";

    return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
        style: "currency",
        currency: "BRL",
    }).format(n);
}

function formatDate(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export default async function EventPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    const t = await getTranslations("event");

    let event;

    try {
        event = await api.events.get(id);
    } catch {
        notFound();
    }

    return (
        <main className="max-w-lg mx-auto px-4 py-10">
            <p className="text-xs text-zinc-400 uppercase tracking-wide">
                {event.city}
            </p>

            <h1 className="mt-1 text-2xl font-bold text-zinc-900">
                {event.title}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
                {t("by")} {event.artist.name}
            </p>

            <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                <span>{formatDate(event.date, locale)}</span>

                <span className="font-semibold text-emerald-600">
                    {formatPrice(event.price, locale)}
                </span>
            </div>

            <BuyForm eventId={event.id} locale={locale} />
        </main>
    );
}
