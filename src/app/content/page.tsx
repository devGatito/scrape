"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Content() {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [fonts, setFonts] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  
  useEffect(() => {
    const storedImages = localStorage.getItem("images");
  const storedVideos = localStorage.getItem("videos");
  const storedFonts = localStorage.getItem("fonts");
  const storedColors = localStorage.getItem("colors");

  console.log("Recuperando datos de localStorage:");
  console.log("Images:", storedImages);
  console.log("Videos:", storedVideos);
  console.log("Fonts:", storedFonts);
  console.log("Colors:", storedColors);

  if (storedImages) setImages(JSON.parse(storedImages));
  if (storedVideos) setVideos(JSON.parse(storedVideos));
  if (storedFonts) setFonts(JSON.parse(storedFonts));
  if (storedColors) setColors(JSON.parse(storedColors));
}, []);

 


  
  

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-medium mb-6">Mis Carpetas</h1>

      
      <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-folder"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <div>
          <h2 className="text-lg font-medium">Photos</h2>
          <p className="text-sm text-gray-400"> {images.length} files</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={img}
                  alt={`Imagen ${idx}`}
                  width={100}
                  height={100}
                  className="cursor-pointer"
                   
                />
                
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-video"
        >
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
        <div>
          <h2 className="text-lg font-medium">Videos</h2>
          <p className="text-sm text-gray-400"> {videos.length} files</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {videos.map((video, idx) => (
              <div key={idx} className="relative">
                <video
                  src={video}
                  controls
                  width={100}
                  height={100}
                  className="cursor-pointer"
                
                />
               
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-type"
        >
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
        <div>
          <h2 className="text-lg font-medium">Fuentes</h2>
          <p className="text-sm text-gray-400">0 folders, {fonts.length} files</p>
          <ul className="list-disc pl-5 mt-2">
            {fonts.map((font, idx) => (
              <li
                key={idx}
                className="cursor-pointer"
                
              >
                {font}
                
              </li>
            ))}
          </ul>
        </div>
      </div>

     
      <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-droplet"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
        <div>
          <h2 className="text-lg font-medium">Paleta de colores</h2>
          <p className="text-sm text-gray-400"> {colors.length} files</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color, idx) => (
              <div key={idx} className="relative">
                <div
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border border-gray-700 cursor-pointer"
                  
                />
                
                <div
                  className="text-xs mt-1"
                  style={{ textDecoration: `underline #${color}` }}
                >
                  {color}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
     
    </div>
  );
}