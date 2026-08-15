import type { Locale } from "@/lib/i18n/types";

/**
 * System prompt for CocinaHelp — home cooking recipes only.
 * Not medical or nutrition professional advice.
 */
export const BotanicaHelp_SYSTEM_PROMPT = `Eres CocinaHelp: asistente de IA para cocinar en casa en España y Europa.

### Alcance (OBLIGATORIO)
- Ayudas con: recetas fáciles, qué cocinar con lo que hay en la nevera o despensa, menús sencillos, tiempos, cantidades y pasos claros.
- Ingredientes típicos de supermercado europeo/español.
- NUNCA prometas adelgazar, curar enfermedades ni resultados de salud. No sustituyes a un médico ni a un nutricionista.
- Si piden dietas médicas, enfermedades graves o menús para menores con problemas de salud: respuesta breve y prudente; recomienda un profesional.
- No inventes marcas ni precios.

### Estilo
- Claro, práctico y amable. Ve al grano.
- Propón 1 receta principal y, si encaja, 1 alternativa rápida.
- Estructura: **Nombre del plato** · Tiempo · Raciones · Ingredientes (con cantidades) · Pasos numerados · Consejo extra.
- Puedes asumir sal, aceite y agua en poca cantidad si faltan.
- Una pregunta final solo si falta un dato importante (lo que tiene, alergias, tiempo disponible).

### Fotos
Si hay foto: qué ingredientes/plato ves → receta realista con eso → pasos concretos.
No digas que “guardas” la foto de forma permanente: se analiza en la sesión.

### Formato
Listas cortas. **Negritas** en lo clave. Sin muros de texto ni emojis excesivos.`;
export function detectLanguage(userText: string, uiLocale: Locale): Locale {
  const t = userText.toLowerCase();
  const esHits =
    (t.match(
      /\b(hola|gracias|cómo|como|qué|que|planta|riego|luz|plaga|ayuda|foto|hojas|tomate|huerto|balcón|balcon)\b/g,
    )?.length ?? 0) + (t.match(/[áéíóúñ¿¡]/g)?.length ?? 0);
  const deHits =
    (t.match(
      /\b(hallo|danke|wie|was|pflanze|gießen|giessen|licht|hilfe|foto|blätter|tomate|garten|balkon)\b/g,
    )?.length ?? 0) + (t.match(/[äöüß]/g)?.length ?? 0);
  const enHits =
    t.match(
      /\b(hello|hi|thanks|how|what|plant|water|watering|light|pest|help|photo|leaves|tomato|garden|balcony)\b/g,
    )?.length ?? 0;

  if (esHits >= deHits && esHits >= enHits && esHits > 0) return "es";
  if (deHits >= esHits && deHits >= enHits && deHits > 0) return "de";
  if (enHits > esHits && enHits > deHits && enHits > 0) return "en";
  return uiLocale;
}

export function buildSystemPrompt(
  language: Locale,
  hasImages = false,
): string {
  const langLine =
    language === "de"
      ? "Antwortsprache: Deutsch. Kontext: Europa. Kurz und konkret."
      : language === "en"
        ? "Reply language: English. Context: Europe. Be concise and practical."
        : "Idioma de respuesta: español. Contexto: Europa. Sé breve y práctico.";

  const bits = [BotanicaHelp_SYSTEM_PROMPT, langLine];

  if (hasImages) {
    bits.push(
      language === "de"
        ? "Foto(s) vorhanden: kurz (sehen → Diagnose → 2–4 Schritte)."
        : language === "en"
          ? "Photo(s) attached: brief (see → likely diagnosis → 2–4 actions)."
          : "Hay foto(s): analiza breve (ver → diagnóstico → 2–4 acciones).",
    );
  }

  return bits.join("\n");
}

export function visionFallbackMessage(language: Locale): string {
  if (language === "de") {
    return "Foto erhalten, Analyse fehlgeschlagen. Welche Farbe, Flecken oder Schädlinge siehst du? Innen oder Balkon?";
  }
  if (language === "en") {
    return "I received the photo but couldn't analyse it. What colour, spots or pests do you see? Indoors or balcony?";
  }
  return "Recibí la foto, pero no pude analizarla. ¿Color, manchas o plagas? ¿Interior o balcón?";
}

export function photoDefaultPrompt(language: Locale, n: number): string {
  if (language === "de") {
    return n > 1
      ? `Analysiere diese ${n} Fotos meiner Pflanze: was siehst du, wahrscheinliche Ursache und was ich jetzt tun soll.`
      : "Analysiere dieses Foto meiner Pflanze: was siehst du, wahrscheinliche Ursache und was ich jetzt tun soll.";
  }
  if (language === "en") {
    return n > 1
      ? `Analyse these ${n} photos of my plant: what you see, likely cause, and what I should do now.`
      : "Analyse this photo of my plant: what you see, likely cause, and what I should do now.";
  }
  return n > 1
    ? `Analiza estas ${n} fotos de mi planta: qué ves, causa probable y qué debo hacer ahora.`
    : "Analiza esta foto de mi planta: qué ves, causa probable y qué debo hacer ahora.";
}
