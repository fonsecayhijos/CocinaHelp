import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-brand-50/80 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link href="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← BotanicaHelp
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-950">Política de privacidad</h1>
          <div className="mt-6 space-y-4 text-brand-900/90 leading-relaxed">
            <p><strong>Responsables:</strong> Vicente Fonseca Rodríguez y Abdón Fonseca Gual, Chipiona (Cádiz), España.</p>
            <p><strong>Contacto:</strong> info@botanicahelp.com</p>
            <p><strong>Datos que tratamos:</strong> email, datos de cuenta, uso del asistente, fotos de plantas que subas y datos de pago gestionados por Stripe.</p>
            <p><strong>Finalidad:</strong> prestar el servicio BotanicaHelp, gestionar suscripciones, mejorar el asistente y cumplir obligaciones legales.</p>
            <p><strong>Base legal:</strong> ejecución del contrato y, cuando proceda, tu consentimiento.</p>
            <p><strong>Conservación:</strong> mientras mantengas la cuenta o el tiempo exigido por la ley.</p>
            <p><strong>Encargados del tratamiento:</strong> Supabase (infraestructura de datos), Stripe (pagos) y xAI (procesamiento de IA).</p>
            <p><strong>Derechos:</strong> puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@botanicahelp.com.</p>
            <p>No vendemos tus datos personales a terceros con fines comerciales.</p>
            
            <h2 className="mt-8 text-xl font-bold text-brand-950">Cookies y tecnologías similares</h2>
            <p>
              BotanicaHelp utiliza cookies y tecnologías similares para:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Garantizar el funcionamiento técnico de la web (cookies necesarias: sesión, seguridad, preferencias de idioma).</li>
              <li>Medir el uso del servicio, si nos das tu consentimiento (analítica).</li>
              <li>Medir y mejorar nuestras campañas publicitarias, si nos das tu consentimiento (marketing), por ejemplo a través del pixel de Meta (Facebook/Instagram).</li>
            </ul>
            <p>
              Las cookies necesarias no requieren consentimiento. Las de analítica y marketing solo se activan si las aceptas en el banner de cookies.
            </p>
            <p>
              Puedes cambiar o retirar tu consentimiento en cualquier momento desde el propio banner o escribiéndonos a{' '}
              <a href="mailto:info@botanicahelp.com" className="font-semibold text-brand-700 hover:underline">
                info@botanicahelp.com
              </a>.
            </p>
            <p>No vendemos tus datos personales.</p>
            <p className="text-sm text-brand-800/70">Última actualización: julio 2026.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
