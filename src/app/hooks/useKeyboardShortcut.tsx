import { useEffect, useState } from "react";

export const useKeyboardShortcut = (keys: string[], callback: () => void) => {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.add(event.key.toLowerCase());
        return newKeys;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key.toLowerCase());

        
        if (newKeys.size === 0) {
          setTriggered(false);
        }

        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (
      keys.every((key) => pressedKeys.has(key.toLowerCase())) &&
      pressedKeys.size === keys.length &&
      !triggered
    ) {
      setTriggered(true);
      callback();
    }
  }, [pressedKeys, keys, triggered, callback]);
};
