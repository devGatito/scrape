import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");

  if (!url || url.trim() === "") {
    return NextResponse.json(
      { error: "No se proporcionó una URL válida" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la página: ${response.statusText}`);
    }

    const html = await response.text();

    // Base URL para convertir rutas relativas a absolutas
    const baseUrl = new URL(url);

    // Función para convertir rutas relativas en absolutas
    const makeAbsolute = (src: string) =>
      src.startsWith("http") ? src : new URL(src, baseUrl).href;

    const imageUrls = [
      ...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g),
    ].map((m) => makeAbsolute(m[1]));

    const videoUrls = [
      ...html.matchAll(/<video[^>]+src=["']([^"']+)["']/g),
    ].map((m) => makeAbsolute(m[1]));

    const fontUrls = [
      ...html.matchAll(/@font-face\s*\{[^}]*url\(["']([^"']+)["']\)/g),
    ].map((m) => makeAbsolute(m[1]));

    // Captura más flexible de colores en estilos inline
    const colorMatches = [
      ...html.matchAll(/style=["'][^"']*color:\s*([^;'" >]+)/gi),
    ];
    const backgroundMatches = [
      ...html.matchAll(/style=["'][^"']*background(?:-color)?:\s*([^;'" >]+)/gi),
    ];
    const colors = new Set([
      ...colorMatches.map((m) => m[1]),
      ...backgroundMatches.map((m) => m[1]),
    ]);

    return NextResponse.json({
      images: imageUrls,
      videos: videoUrls,
      fonts: fontUrls,
      colors: [...colors],
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la página" },
      { status: 500 }
    );
  }
}
