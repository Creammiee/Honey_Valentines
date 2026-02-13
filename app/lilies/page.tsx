"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/liliesStyles.scss";

export default function LiliesPage() {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const [readyToLetter, setReadyToLetter] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    document.body.classList.add("not-loaded");

    const timer = window.setTimeout(() => {
      document.body.classList.remove("not-loaded");
    }, 1000);

    const textTimer = window.setTimeout(() => {
      setShowText(true);
    }, 6500);

    timersRef.current.push(
      timer as unknown as number,
      textTimer as unknown as number
    );

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const openLetter = () => {
    if (animating) return;

    if (!readyToLetter) {
      setReadyToLetter(true);
      const cancel = window.setTimeout(() => setReadyToLetter(false), 2000);
      timersRef.current.push(cancel as unknown as number);
      return;
    }

    setAnimating(true);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    setTimeout(() => router.push("/letter"), 350);
  };

  const goBack = () => {
    if (animating) return;
    setAnimating(true);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setTimeout(() => router.back(), 350);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black flex items-end justify-center"
      style={{
        perspective: "1000px",
        transition: "opacity 350ms ease-out",
        opacity: animating ? 0 : 1,
        pointerEvents: animating ? "none" : "auto",
      }}
    >
      <div className="night"></div>

      {/* FLOWER WORLD */}
      <div className="flowers-wrapper">
        <div className="flowers">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`flower flower--${num}`}>
              <div className={`flower__leafs flower__leafs--${num}`}>
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`flower__light flower__light--${i + 1}`}
                  />
                ))}
              </div>

              <div className="flower__line">
                {[...Array(num === 1 ? 6 : 4)].map((_, i) => (
                  <div
                    key={i}
                    className={`flower__line__leaf flower__line__leaf--${i + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="grow-ans" style={{ "--d": "1.2s" } as any}>
            <div className="flower__g-long">
              <div className="flower__g-long__top"></div>
              <div className="flower__g-long__bottom"></div>
            </div>
          </div>

          {[1, 2].map((num) => (
            <div key={num} className="growing-grass">
              <div className={`flower__grass flower__grass--${num}`}>
                <div className="flower__grass--top"></div>
                <div className="flower__grass--bottom"></div>

                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`flower__grass__leaf flower__grass__leaf--${i + 1}`}
                  />
                ))}

                <div className="flower__grass__overlay"></div>
              </div>
            </div>
          ))}

          <div className="grow-ans" style={{ "--d": "2.4s" } as any}>
            <div className="flower__g-right flower__g-right--1">
              <div className="leaf"></div>
            </div>
          </div>

          <div className="grow-ans" style={{ "--d": "2.8s" } as any}>
            <div className="flower__g-right flower__g-right--2">
              <div className="leaf"></div>
            </div>
          </div>
        </div>
      </div>

      {/* TITLE WITH COMIC SANS */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 pointer-events-none"
        style={{
          opacity: showText ? 1 : 0,
          animation: showText ? "popInText 0.8s ease-out forwards" : "none",
          fontFamily: `"Comic Sans MS", "Comic Sans", cursive`,
        }}
      >
        <h1 className="text-6xl drop-shadow-2xl">
          Happy Valentine's Day
        </h1>
        <h2 className="mt-6 text-4xl">
          Honeyleth ❤️
        </h2>
      </div>

      {/* Envelope Button */}
      <button
        onClick={openLetter}
        aria-label="Open letter"
        className={`absolute bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full ${readyToLetter ? "bg-white/20" : "bg-white/10"
          } text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none`}
        type="button"
        disabled={animating}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
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
          strokeWidth="1.6"
          className="h-6 w-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <style>{`
        @keyframes popInText {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(30px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}