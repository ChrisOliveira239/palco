import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import { EventCard } from "@/components/EventCard";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("home");

    const events = await api.events.list();
    const published = events.filter((e) => e.status === "PUBLISHED");

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-zinc-900 mb-8">
                {t("title")}
            </h1>

            {published.length === 0 ? (
                <p className="text-zinc-500">{t("empty")}</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {published.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            locale={locale}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}
