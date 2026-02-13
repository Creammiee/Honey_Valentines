"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { allCompleted } from "@/lib/progress";

export default function Home() {
  const router = useRouter();

  const [hasKey, setHasKey] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [gamesCompleted, setGamesCompleted] = useState({
    game1: false,
    game2: false,
    game3: false,
  });

  useEffect(() => {
    setHasKey(allCompleted());
    setGamesCompleted({
      game1: localStorage.getItem("game1") === "done",
      game2: localStorage.getItem("game2") === "done",
      game3: localStorage.getItem("game3") === "done",
    });
  }, []);

  const handleKeyDrop = (info: any) => {
    const heart = document.getElementById("heart");
    if (!heart) return;

    const rect = heart.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (Math.abs(info.point.x - cx) < 80 && Math.abs(info.point.y - cy) < 80) {
      setUnlocked(true);
      setAnimating(true);
      setTimeout(() => router.push("/unlock"), 900);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-black text-white transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="flex gap-6 mb-16">
        {["game1", "game2", "game3"].map((g, i) => (
          <button
            key={g}
            onClick={() => router.push(`/${g}`)}
            className="relative px-7 py-3 rounded-xl bg-pink-600 font-semibold text-lg hover:scale-110 transition"
          >
            Game {i + 1}
            {gamesCompleted[g as keyof typeof gamesCompleted] && (
              <span className="absolute -top-2 -right-2 bg-white text-green-500 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-12">
        {/* HEART WITH BIGGER TOP CURVES */}
        <div id="heart" className="relative w-40 h-36">
          {/* Bigger left circle */}
          <div className="absolute w-24 h-24 bg-pink-500 rounded-full left-0 top-0" />

          {/* Bigger right circle */}
          <div className="absolute w-24 h-24 bg-pink-500 rounded-full right-0 top-0" />

          {/* Bottom diamond */}
          <div className="absolute w-24 h-24 bg-pink-500 rotate-45 left-1/2 top-8 -translate-x-1/2" />

          {/* Keyhole */}
          <div className="absolute w-3 h-8 bg-black rounded-full left-1/2 top-18 -translate-x-1/2 z-10" />

          {unlocked && (
            <div className="absolute inset-0 animate-pulse bg-pink-500 opacity-25 blur-xl rounded-full" />
          )}
        </div>

        {hasKey && !unlocked && (
          <motion.div
            drag
            dragConstraints={{ left: -240, right: 240, top: -200, bottom: 200 }}
            onDragEnd={(e, info) => handleKeyDrop(info)}
            className="text-6xl cursor-grab select-none hover:scale-125 transition"
            whileTap={{ scale: 0.9 }}
          >
            🗝️
          </motion.div>
        )}

        {!hasKey && (
          <p className="text-sm opacity-60">
            Complete all games to unlock ❤️
          </p>
        )}
      </div>
    </div>
  );
}