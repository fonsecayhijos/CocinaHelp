import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RECETAS = [
  {
    name: "Paella",
    time: "45–60 min",
    idea: "Arroz, pollo o marisco, pimiento, azafrán o colorante",
    image:
      "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=900&q=80",
    alt: "Paella en paellera",
  },
  {
    name: "Pasta al tomate",
    time: "20 min",
    idea: "Pasta, tomate, ajo, aceite de oliva, albahaca o orégano",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80",
    alt: "Plato de pasta con tomate",
  },
  {
    name: "Tortilla de patatas",
    time: "30–40 min",
    idea: "Huevos, patatas, cebolla, aceite, sal",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900&q=80",
    alt: "Tortilla de patatas",
  },
  {
    name: "Pollo a la plancha",
    time: "25 min",
    idea: "Pechuga de pollo, aceite, limón, ajo, sal y pimienta",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
    alt: "Pollo a la plancha con guarnición",
  },
  {
    name: "Ensalada completa",
    time: "15 min",
    idea: "Lechuga, tomate, huevo, atún o queso, aceite y vinagre",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80",
    alt: "Ensalada bowl colorida",
  },
  {
    name: "Arroz con verduras",
    time: "30 min",
    idea: "Arroz, pimiento, calabacín, cebolla, caldo o agua",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=80",
    alt: "Arroz salteado con verduras",
  },
  {
    name: "Pasta cremosa",
    time: "20 min",
    idea: "Pasta, nata o queso crema, ajo, queso rallado",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80",
    alt: "Pasta cremosa en plato",
  },
  {
    name: "Revuelto de verduras",
    time: "15 min",
    idea: "Huevos, pimiento, cebolla, aceite, sal",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=80",
    alt: "Huevos revueltos con verduras",
  },
] as const;

export default function RecetasPage() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-brand-50/80 to-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-8 max-w-2xl">
            <Link
              href="/"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              ← CocinaHelp
            </Link>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
              Ideas de cocina
            </h1>
            <p className="mt-2 text-sm text-brand-800/75 sm:text-base">
              Platos sencillos con ingredientes habituales. Elige uno y pide la
              receta paso a paso al asistente.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RECETAS.map((r) => (
              <article
                key={r.name}
                className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-brand-50">
                  <Image
                    src={r.image}
                    alt={r.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-brand-950">{r.name}</h2>
                  <p className="mt-1 text-xs font-medium text-brand-600">
                    {r.time}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-800/75">
                    {r.idea}
                  </p>
                  <Link
                    href="/ayuda"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Pedir receta al asistente
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}