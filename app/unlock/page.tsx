"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Tile = {
  id: number;
  src: string;
  animation: any;
};

export default function ValentineExperience() {
  const router = useRouter();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [imagePool, setImagePool] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const timers = useRef<number[]>([]);
  const touchStartY = useRef<number>(0);

  // Fetch images
  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((img: string) => `/images/${img}`);
        setImagePool(formatted);
      });

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY.current - touchEndY;

      if (swipeDistance < -80) {
        router.push("/lilies");
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [router]);

  const goToLiliesWithAnim = () => {
    setAnimating(true);
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setTimeout(() => router.push("/lilies"), 350);
  };

  const goBack = () => {
    if (animating) return;
    setAnimating(true);
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setTimeout(() => router.back(), 350);
  };

  const getRandomImage = () =>
    imagePool[Math.floor(Math.random() * imagePool.length)];

  const getRandomAnimation = () => {
    const options = [
      { scale: [1, 1.1, 1] },
      { rotate: [0, 6, -6, 0] },
      { y: [0, -10, 0] },
      { opacity: [1, 0.7, 1] },
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  // Initialize grid
  useEffect(() => {
    if (imagePool.length === 0) return;

    const initial = Array.from({ length: 12 }).map((_, index) => ({
      id: index,
      src: getRandomImage(),
      animation: getRandomAnimation(),
    }));

    setTiles(initial);
  }, [imagePool]);

  // Independent looping per tile
  useEffect(() => {
    if (tiles.length === 0) return;

    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];

    tiles.forEach((tile, index) => {
      const schedule = () => {
        const delay = 3000 + Math.random() * 4000;

        const timer = window.setTimeout(() => {
          setTiles((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              src: getRandomImage(),
              animation: getRandomAnimation(),
            };
            return updated;
          });

          schedule();
        }, delay);

        timers.current.push(timer);
      };

      const starter = window.setTimeout(schedule, Math.random() * 2000);
      timers.current.push(starter);
    });

    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, [tiles.length]);

  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col items-center justify-center p-6 relative"
      style={{
        perspective: "1000px",
        touchAction: "none",
        transition: "opacity 350ms ease-out",
        opacity: animating ? 0 : 1,
        pointerEvents: animating ? "none" : "auto",
      }}
    >
      <div className="night"></div>

      {/* Caption ABOVE the grid */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center mb-10 px-4"
      >
        <h1
          className="text-white text-2xl md:text-3xl lg:text-4xl"
          style={{
            fontFamily: `"Comic Sans MS", "Comic Sans", cursive`,
            textShadow: "0 4px 20px rgba(255,150,200,0.6)",
          }}
        >
          Every photo is proof that loving you is my favorite decision.
        </h1>
      </motion.div>

      {/* Grid */}
      <div
        className="grid grid-cols-4 gap-4 w-full max-w-6xl relative z-10"
        style={{ gridTemplateRows: "repeat(3, 180px)" }}
      >
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            className="relative w-full h-full overflow-hidden rounded-3xl border-4 border-rose-200 shadow-[0_10px_30px_rgba(255,150,200,0.4)] bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400"
            animate={tile.animation}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            <motion.img
              key={tile.src}
              src={tile.src}
              alt="memory"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={goToLiliesWithAnim}
        aria-label="Go to lilies"
        className={`absolute bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full ${animating ? "bg-white/20" : "bg-white/10"
          } text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none`}
        type="button"
        disabled={animating}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Back Button */}
      <button
        onClick={goBack}
        aria-label="Back"
        className="absolute bottom-8 left-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none"
        type="button"
        disabled={animating}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 12H5M12 19l-7-7 7-7"
          />
        </svg>
      </button>

      <style>{`
        .night {
          position: fixed;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          filter: blur(0.1vmin);
          background-image: radial-gradient(
              ellipse at top,
              transparent 0%,
              #000
            ),
            radial-gradient(
              ellipse at bottom,
              #000,
              rgba(145, 233, 255, 0.2)
            ),
            repeating-linear-gradient(
              220deg,
              rgb(0, 0, 0) 0px,
              rgb(0, 0, 0) 19px,
              transparent 19px,
              transparent 22px
            ),
            repeating-linear-gradient(
              189deg,
              rgb(0, 0, 0) 0px,
              rgb(0, 0, 0) 19px,
              transparent 19px,
              transparent 22px
            ),
            repeating-linear-gradient(
              148deg,
              rgb(0, 0, 0) 0px,
              rgb(0, 0, 0) 19px,
              transparent 19px,
              transparent 22px
            ),
            linear-gradient(90deg, rgb(0, 255, 250), rgb(240, 240, 240));
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}