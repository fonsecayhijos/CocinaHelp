# BotanicaHelp

Ayuda con inteligencia artificial para el cuidado de plantas: frutas, verduras, huerto, balcón y plantas de interior en Europa.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm

## Arranque en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts

| Comando        | Descripción              |
| -------------- | ------------------------ |
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Build de producción      |
| `npm run start`| Servidor de producción   |
| `npm run lint` | Linter ESLint            |

## Estructura

```
src/
  app/                 # App Router (páginas)
  components/          # UI: Hero, planes, footer, asistente…
  lib/i18n/            # Diccionarios ES / DE / EN
```

## Idiomas

Selector en el header: **Español**, **Deutsch**, **English**.  
Los textos viven en `src/lib/i18n/dictionaries.ts`.

## Stripe (suscripciones)

Planes de pago mensuales vía **Stripe Checkout** (modo test primero):

| Plan      | Precio     | Variable de entorno        |
| --------- | ---------- | -------------------------- |
| Huerto    | 9,99 €/mes | `STRIPE_PRICE_HUERTO`      |
| Ilimitado | 19,99 €/mes| `STRIPE_PRICE_ILIMITADO`   |

Claves en `.env.local` (ver `.env.example`):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Publishable key (`pk_test_…`)
- `STRIPE_SECRET_KEY` — Secret key (`sk_test_…`)
- `STRIPE_PRICE_HUERTO` / `STRIPE_PRICE_ILIMITADO` — Price IDs (`price_…`)
- `STRIPE_WEBHOOK_SECRET` — Webhook signing secret (`whsec_…`)
- `NEXT_PUBLIC_APP_URL` — URL pública (p. ej. `http://localhost:3000`)

Flujo: página de precios → Checkout → `/billing/success` activa el plan.

## Aviso

Información orientativa. El usuario es responsable del cuidado de sus plantas.
