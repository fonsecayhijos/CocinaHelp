import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-brand-50/80 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link href="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← BotanicaHelp
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-950">Términos y condiciones</h1>
          <div className="mt-6 space-y-4 text-brand-900/90 leading-relaxed">
            <p>
              BotanicaHelp es un servicio de orientación sobre el cuidado de plantas mediante inteligencia artificial,
              operado por Vicente Fonseca Rodríguez y Abdón Fonseca Gual (Chipiona, Cádiz, España).
            </p>
            <p>
              La información ofrecida es orientativa. No sustituye el criterio de un profesional agrónomo,
              jardinero o técnico. Tú eres responsable del cuidado de tus plantas.
            </p>
            <p>
              Ofrecemos planes Gratuitos y de pago (Huerto e Ilimitado). Los precios y límites se indican en la web.
              Los pagos y suscripciones se gestionan a través de Stripe.
            </p>
            <p>
              Puedes cancelar tu suscripción desde tu cuenta o escribiendo a info@botanicahelp.com.
            </p>
            <p>
              Está prohibido el uso ilegal del servicio, el abuso de la plataforma o cualquier intento de dañar el sistema.
            </p>
            <p>
              El contenido, la marca y el software de BotanicaHelp están protegidos. No está permitida su copia o reventa no autorizada.
            </p>
            <p>
              En la medida permitida por la ley, la responsabilidad del servicio se limita al importe pagado en los últimos 12 meses.
            </p>
            <p>
              Estos términos se rigen por la legislación española. Para cualquier controversia, los juzgados de Cádiz serán competentes,
              sin perjuicio de los derechos que correspondan a los consumidores.
            </p>
            <p>
              Contacto: <a href="mailto:info@botanicahelp.com" className="font-semibold text-brand-700 hover:underline">info@botanicahelp.com</a>
            </p>
            <p className="text-sm text-brand-800/70">Última actualización: julio 2026.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
