import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || url.trim() === "") {
    return NextResponse.json({ error: "No se proporcionó una URL válida" }, { status: 400 });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath() || "/usr/bin/google-chrome-stable",
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForSelector("img", { timeout: 5000 }).catch(() => {});

    // Obtener imágenes
    const imageUrls = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"))
        .map((img) => img.src)
        .filter((src) => src.startsWith("http"));

      const bgImages = Array.from(document.querySelectorAll("[style]"))
        .map((el) => {
          const match = (el as HTMLElement).style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
          return match ? match[1] : null;
        })
        .filter((url) => url && url.startsWith("http"));

      return Array.from(new Set([...images, ...bgImages]));
    });

    // Obtener videos
    const videoUrls = await page.evaluate(() => {
      const videos = Array.from(document.querySelectorAll("video"))
        .map((video) => video.src)
        .filter((src) => src.startsWith("http"));

      const iframes = Array.from(document.querySelectorAll("iframe"))
        .map((iframe) => iframe.src)
        .filter((src) => src.startsWith("http"));

      return Array.from(new Set([...videos, ...iframes]));
    });

    // Obtener fuentes
    const fonts = await page.evaluate(() => {
      const fontFamilies = new Set<string>();
      document.querySelectorAll("*").forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily;
        fontFamilies.add(fontFamily);
      });
      return Array.from(fontFamilies);
    });

    // Obtener colores
    const colors = await page.evaluate(() => {
      function rgbToHex(rgb: string) {
        const match = rgb.match(/\d+/g);
        if (!match || match.length < 3) return rgb; // Retorna original si no es un RGB válido
        return `#${match.slice(0, 3).map(x => ('0' + parseInt(x).toString(16)).slice(-2)).join('')}`;
      }

      const colorSet = new Set<string>();
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
      colors: colors 
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "No se pudo obtener la página", details: (error as Error).message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
