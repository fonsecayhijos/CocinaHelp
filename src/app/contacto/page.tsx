import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-brand-50/80 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link href="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← BotanicaHelp
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-950">Contacto</h1>
          <div className="mt-6 space-y-4 text-brand-900/90 leading-relaxed">
            <p>
              BotanicaHelp es un servicio operado por Vicente Fonseca Rodríguez y Abdón Fonseca Gual,
              con domicilio en Chipiona (Cádiz), España.
            </p>
            <p>
              Para cualquier consulta sobre el servicio, tu cuenta o facturación, escríbenos a:
            </p>
            <p>
              <a href="mailto:info@botanicahelp.com" className="font-semibold text-brand-700 hover:underline">
                info@botanicahelp.com
              </a>
            </p>
            <p>Intentamos responder en el menor tiempo posible.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
