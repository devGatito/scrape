"use client";
import { useState, useEffect, useMemo } from "react";
import { useDraggableResizable } from "./hooks/useDraggableResizable";
import Terminal from "./components/Terminal";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [terminals, setTerminals] = useState<{ id: number; url: string; x: number; y: number }[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const commands = useMemo(() => ["➜ _ingresa url()"], []);

  const { position, size, isFullscreen, handleMouseDown, handleResizeMouseDown, toggleFullscreen } =
    useDraggableResizable({
      initialPosition: { x: 50, y: 50 },
      initialSize: { width: 600, height: 400 },
    });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  useEffect(() => {
    if (index < commands.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + commands[index] + "\n");
        setIndex((prevIndex) => prevIndex + 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [index, commands]);

  
  const handleClose = () => setIsClosed(true);

 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  
  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setText((prev) => prev + `➜ ${input}\n`);
      if (input.startsWith("http")) {
        const newX = 100 + terminals.length * 50;
        const newY = 100 + terminals.length * 50;

        setTerminals((prev) => [
          ...prev,
          {
            id: Date.now(),
            url: input,
            x: newX,
            y: newY,
          },
        ]);
      }
      setInput("");
    }
  };

  
  const handleTerminalClose = (id: number) => {
    setTerminals((prev) => prev.filter((terminal) => terminal.id !== id));
  };

 
  if (isClosed) return <div className="flex items-center justify-center min-h-screen bg-gray-900" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      
      <div
        style={{
          position: "absolute",
          left: isFullscreen || isMobile ? "0" : `${position.x}px`,
          top: isFullscreen || isMobile ? "0" : `${position.y}px`,
          width: isFullscreen || isMobile ? "100vw" : `${size.width}px`,
          height: isFullscreen || isMobile ? "100vh" : `${size.height}px`,
        }}
        className={`bg-black rounded-lg shadow-lg border-gray-700 overflow-hidden ${
          isMobile ? "rounded-none" : ""
        }`}
      >
       
        <div
          className="flex items-center px-3 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer" onClick={handleClose}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer" onClick={toggleFullscreen}></div>
          </div>
          <span className="ml-auto text-gray-400 text-xs">terminal</span>
        </div>

        
        <div className="p-4 text-green-400 font-mono whitespace-pre-wrap h-[80%] overflow-auto">
          {text}
        </div>

       
        <form className="p-2 border-t border-gray-700 flex" onSubmit={handleInputSubmit}>
          <span className="text-green-400">➜</span>
          <input
            type="text"
            className="bg-black text-green-100 font-mono w-full outline-none ml-2"
            value={input}
            onChange={handleInputChange}
            autoFocus
          />
        </form>

     
        {!isFullscreen && !isMobile && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-500"
            onMouseDown={handleResizeMouseDown}
          ></div>
        )}
      </div>

      
      {terminals.map((terminal) => (
        <Terminal
          key={terminal.id}
          url={terminal.url}
          onClose={() => handleTerminalClose(terminal.id)}
          position={{ x: terminal.x, y: terminal.y }}
        />
      ))}
    </div>
  );
}