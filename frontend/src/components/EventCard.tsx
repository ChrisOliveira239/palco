import { Link } from "@/lib/navigation";
import type { Event } from "@/types";

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
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export function EventCard({ event, locale }: { event: Event; locale: string }) {
    return (
        <Link
            href={`/events/${event.id}`}
            className="block rounded-xl border border-zinc-200 p-4 hover:shadow-md transition-shadow"
        >
            <p className="text-xs text-zinc-400 uppercase tracking-wide">
                {event.city}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                {event.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{event.artist.name}</p>
            <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                    {formatDate(event.date, locale)}
                </span>
                <span className="text-sm font-medium text-emerald-600">
                    {formatPrice(event.price, locale)}
                </span>
            </div>
        </Link>
    );
}
