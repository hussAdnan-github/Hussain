import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { defaultHomeSections, mergeHomeSections, type ClientsTexts } from "@/lib/homeSections";

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number | null;
}

// Minimum number of partners required to switch from static layout to the carousel.
const CAROUSEL_MIN_COUNT = 4;

interface ClientCardProps {
  client: ClientLogo;
  className?: string;
}

const ClientCard = ({ client, className = "" }: ClientCardProps) => {
  const containerClass = `group flex items-center justify-center transition-transform duration-300 ${className}`;

  const inner = (
    <div className="w-full h-full flex items-center justify-center">
      {client.logo_url ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={client.logo_url}
            alt={client.name}
            title={client.name}
            className="max-h-12 md:max-h-14 max-w-[130px] md:max-w-[160px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
            loading="lazy"
          />
        </div>
      ) : (
        <span className="text-foreground-700 group-hover:text-primary-600 font-bold text-xs md:text-sm text-center leading-snug transition-colors line-clamp-1 whitespace-nowrap px-2">
          {client.name}
        </span>
      )}
    </div>
  );

  return client.website_url ? (
    <a
      href={client.website_url}
      target="_blank"
      rel="noopener noreferrer"
      title={client.name}
      className={`${containerClass} cursor-pointer`}
    >
      {inner}
    </a>
  ) : (
    <div title={client.name} className={`${containerClass} cursor-default`}>
      {inner}
    </div>
  );
};

interface MarqueeRowProps {
  items: ClientLogo[];
  direction: "left" | "right";
}

const MarqueeRow = ({ items, direction }: MarqueeRowProps) => {
  if (items.length === 0) return null;

  // Repeat the row enough times so the strip always fills the viewport,
  // then duplicate the whole tile so a -50% shift loops seamlessly.
  const repeats = Math.max(4, Math.ceil(24 / items.length));
  const tile = Array.from({ length: repeats }).flatMap(() => items);
  const loop = [...tile, ...tile];

  return (
    <div className={`clients-track ${direction === "left" ? "clients-track-left" : "clients-track-right"} py-1.5 md:py-2`}>
      {loop.map((client, index) => (
        <ClientCard
          key={`${client.id}-${index}`}
          client={client}
          className="h-14 md:h-16 px-2.5 sm:px-3.5 md:px-4 mx-1 sm:mx-1.5 md:mx-2 flex-shrink-0"
        />
      ))}
    </div>
  );
};

const ClientsSection = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [texts, setTexts] = useState<ClientsTexts>(defaultHomeSections.clients);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const [clientsRes, settingsRes] = await Promise.all([
          supabase
            .from("client_logos")
            .select("id, name, logo_url, website_url, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true, nullsFirst: false })
            .order("created_at", { ascending: true }),
          supabase.from("site_settings").select("home_sections").eq("id", 1).maybeSingle(),
        ]);

        if (clientsRes.error) throw clientsRes.error;
        setClients(clientsRes.data || []);

        if (settingsRes.data?.home_sections) {
          setTexts(mergeHomeSections(settingsRes.data.home_sections).clients);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "فشل تحميل العملاء");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <section id="clients" className="py-14 md:py-20 bg-background-50" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground-600 mt-4 text-sm">جاري تحميل الشركاء...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="clients" className="py-14 md:py-20 bg-background-50" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-red-500 text-sm">حدث خطأ: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-primary-500 text-sm underline cursor-pointer">إعادة المحاولة</button>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  const useCarousel = clients.length >= CAROUSEL_MIN_COUNT;
  const displayedClients = clients;
  const rowOne = displayedClients.filter((_, index) => index % 2 === 0);
  const rowTwo = displayedClients.filter((_, index) => index % 2 === 1);

  return (
    <section id="clients" className="py-14 md:py-20 bg-background-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-0.5 bg-primary-500"></div>
            <span className="text-primary-600 text-xs font-semibold tracking-wider uppercase">{texts.badge}</span>
            <div className="w-6 h-0.5 bg-primary-500"></div>
          </div>
          <h2 className={`text-2xl md:text-3xl font-black text-foreground-950 leading-tight ${texts.subtitle ? "mb-2" : ""}`}>
            {texts.title}
          </h2>
          {texts.subtitle && (
            <p className="text-foreground-600 text-sm max-w-md mx-auto">
              {texts.subtitle}
            </p>
          )}
        </div>

        {useCarousel ? (
          /* Two-row marquee carousel */
          <div className="relative overflow-hidden clients-marquee -mx-4 md:mx-0" dir="ltr">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-background-50 to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-background-50 to-transparent z-10"></div>

            <div className="space-y-3 md:space-y-4">
              <MarqueeRow items={rowOne} direction="left" />
              <MarqueeRow items={rowTwo} direction="right" />
            </div>
          </div>
        ) : (
          /* Static layout for fewer than 4 partners */
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {displayedClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                className="h-14 md:h-16 px-4 md:px-6"
              />
            ))}
          </div>
        )}

        {/* Learn more */}
        <div className="text-center mt-10">
          <Link
            to="/clients"
            className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
          >
            <span>معرفة المزيد</span>
            <i className="ri-arrow-left-line text-sm"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;