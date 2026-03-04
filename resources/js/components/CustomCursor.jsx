import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (
                e.target.tagName === "BUTTON" ||
                e.target.tagName === "A" ||
                e.target.closest("button") ||
                e.target.closest("a")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-indigo-600 rounded-full pointer-events-none z-[10000] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                    scale: isHovering ? 0.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
            />

            {/* Cursor ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border-2 border-indigo-500 rounded-full pointer-events-none z-[10000] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            />

            {/* Trailing particles */}
            <motion.div
                className="fixed top-0 left-0 w-1 h-1 bg-purple-400 rounded-full pointer-events-none z-[9998] opacity-60"
                animate={{
                    x: mousePosition.x - 2,
                    y: mousePosition.y - 2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                }}
            />
            <motion.div
                className="fixed top-0 left-0 w-1 h-1 bg-pink-400 rounded-full pointer-events-none z-[9998] opacity-40"
                animate={{
                    x: mousePosition.x - 2,
                    y: mousePosition.y - 2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 25,
                }}
            />
        </>
    );
}
