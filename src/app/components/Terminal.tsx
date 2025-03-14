"use client";
import { useEffect, useState } from "react";
import { useDraggableResizable } from "../hooks/useDraggableResizable";
import { useRouter } from "next/navigation";

interface TerminalProps {
  url: string;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function Terminal({ url, onClose, position }: TerminalProps) {
  const {
    position: terminalPosition,
    size,
    isFullscreen,
    handleMouseDown,
    handleResizeMouseDown,
    toggleFullscreen,
  } = useDraggableResizable({
    initialPosition: position,
    initialSize: { width: 600, height: 400 },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);

  const router = useRouter();

  // ✅ Función de extracción de datos
  const extractData = async () => {
    console.log("🔍 URL recibida:", url);
    if (!url.trim()) {
      setError("Confirma la URL");
      return;
    }

    setLoading(true);
    setError("");
    setExtractionSuccess(false);

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        console.error("Error en la API:", response.status, await response.text());
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📌 Datos obtenidos de la API:", data);

      localStorage.setItem("images", JSON.stringify(data.images ?? []));
      localStorage.setItem("videos", JSON.stringify(data.videos ?? []));
      localStorage.setItem("fonts", JSON.stringify(data.fonts ?? []));
      localStorage.setItem("colors", JSON.stringify(data.colors ?? []));

      setExtractionSuccess(true);
    } catch (error) {
      console.error("Error al extraer datos:", error);
      setError("No se pudo extraer datos.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ejecuta `extractData` cuando `url` cambie
  useEffect(() => {
    if (url.trim()) {
      extractData();
    }
  }, [url]);

  // ✅ Manejo de la responsividad
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Función para redirigir a /content
  const handleRedirectToContent = () => {
    router.push("/content");
  };

  return (
    <div
      style={{
        position: "absolute",
        left: isFullscreen || isMobile ? "0" : `${terminalPosition.x}px`,
        top: isFullscreen || isMobile ? "0" : `${terminalPosition.y}px`,
        width: isFullscreen || isMobile ? "100vw" : `${size.width}px`,
        height: isFullscreen || isMobile ? "100vh" : `${size.height}px`,
      }}
      className={`bg-black shadow-lg border-gray-700 overflow-hidden ${
        isMobile ? "rounded-none" : "rounded-lg"
      }`}
    >
      <div
        className="flex items-center px-3 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer" onClick={onClose}></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer" onClick={toggleFullscreen}></div>
        </div>
        <span className="ml-auto text-gray-400 text-xs">terminal</span>
      </div>

      <div className="p-4 text-green-400 font-mono whitespace-pre-wrap h-[80%] overflow-auto">
        {loading && <p>Cargando datos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && extractionSuccess && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Extracción exitosa</h3>
            <p className="text-sm text-gray-400 mb-4">
              Los datos se han extraído correctamente.
            </p>
            <button
              onClick={handleRedirectToContent}
              className="text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ver contenido
            </button>
          </div>
        )}
      </div>

      {!isMobile && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-700"
          onMouseDown={handleResizeMouseDown}
        ></div>
      )}
    </div>
  );
}
