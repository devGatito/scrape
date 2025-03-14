import { NextResponse } from "next/server";
import { chromium, firefox, webkit } from "playwright";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const browserType = searchParams.get("browser");

  if (!url || url.trim() === "") {
    return NextResponse.json(
      { error: "No se proporcionó una URL válida" },
      { status: 400 }
    );
  }

  let browser;
  try {
    // Seleccionar navegador dinámicamente
    const browserInstance =
      browserType === "firefox"
        ? firefox
        : browserType === "webkit"
        ? webkit
        : chromium;

    browser = await browserInstance.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Necesario en Vercel
      executablePath: browserInstance.executablePath(), // Usa el path correcto en Vercel
      headless: true,
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    });

    await page.goto(url, { waitUntil: "networkidle" });

    // Obtener imágenes
    const imageUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img"))
        .map((img) => img.src)
        .filter((src) => src.startsWith("http"))
    );

    // Obtener videos
    const videoUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("video"))
        .map((video) => video.src)
        .filter((src) => src.startsWith("http"))
    );

    // Obtener fuentes
    const fonts = await page.evaluate(() => {
      const fontFamilies = new Set();
      document.querySelectorAll("*").forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        fontFamilies.add(computedStyle.fontFamily);
      });
      return Array.from(fontFamilies);
    });

    // Obtener colores
    const colors = await page.evaluate(() => {
      function rgbToHex(rgb: string) {
        const match = rgb.match(/\d+/g);
        if (!match || match.length < 3) return rgb;
        return `#${match
          .slice(0, 3)
          .map((x) => ("0" + parseInt(x).toString(16)).slice(-2))
          .join("")}`;
      }

      const colorSet = new Set();
      document.querySelectorAll("*").forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        colorSet.add(rgbToHex(computedStyle.color));
        colorSet.add(rgbToHex(computedStyle.backgroundColor));
      });

      return Array.from(colorSet);
    });

    await browser.close();

    return NextResponse.json({
      images: imageUrls,
      videos: videoUrls,
      fonts: fonts,
      colors: colors,
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la página" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
