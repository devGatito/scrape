import React, { useState } from "react";
import { motion } from "framer-motion";
import elements from "./elements.json";

// Componente reutilizable para cada submenú
const Submenu = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      {/* Botón del submenú */}
      <div
        className="p-2 bg-gray-800 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </div>

      {/* Lista animada */}
      <motion.ul
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden pl-4"
      >
        {items.map((item, index) => (
          <motion.li
            key={index}
            className="p-2 hover:bg-gray-700 rounded cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
          >
            {`<${item}>`}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

// Componente principal
const SliderNavbar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">HTML Elements</h2>

      {/* Renderizar múltiples submenús */}
      <Submenu title="Elements" items={elements.html.elements} />
      <Submenu title="More Elements" items={elements.html.elements.slice(0, 10)} />
      <Submenu title="Extra Elements" items={elements.html.elements.slice(10, 20)} />
    </div>
  );
};

export default SliderNavbar;
