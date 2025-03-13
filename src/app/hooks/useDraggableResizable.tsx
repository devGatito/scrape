import { useState, useEffect, useRef } from "react";

interface UseDraggableResizableProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export const useDraggableResizable = ({
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 350 },
}: UseDraggableResizableProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0, x: 0, y: 0 });

 
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isFullscreen) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

 
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    setIsResizing(true);
    startSize.current = {
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!isResizing || isFullscreen) return;
    setSize({
      width: Math.max(300, startSize.current.width + (e.clientX - startSize.current.x)),
      height: Math.max(200, startSize.current.height + (e.clientY - startSize.current.y)),
    });
  };

  const handleResizeMouseUp = () => setIsResizing(false);

 
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setPosition({ x: 0, y: 0 });
    }
  };

 
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleResizeMouseMove);
    document.addEventListener("mouseup", handleResizeMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleResizeMouseMove);
      document.removeEventListener("mouseup", handleResizeMouseUp);
    };
  }, [isDragging, isResizing]);

  return {
    position,
    size,
    isFullscreen,
    handleMouseDown,
    handleResizeMouseDown,
    toggleFullscreen,
  };
};
