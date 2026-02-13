"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/liliesStyles.scss";
import "@/styles/envelope.scss";

export default function LetterPage() {
    const router = useRouter();
    const [letterContent, setLetterContent] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [showLetter, setShowLetter] = useState(false);

    useEffect(() => {
        // Fetch the letter content
        fetch("/letter.txt")
            .then((res) => res.text())
            .then((text) => setLetterContent(text))
            .catch((err) => console.error("Failed to load letter", err));
    }, []);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);
        // Wait for envelope animation to finish before showing the full letter overlay
        setTimeout(() => {
            setShowLetter(true);
        }, 800);
    };

    const handleClose = () => {
        setShowLetter(false);
        // Optionally reset envelope? No, keep it open visually or navigate back?
        // Let's just hide the overlay so they can see the envelope again or the background.
    };

    const goBack = () => {
        router.back();
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
            <div className="night"></div>

            {/* CENTERED FLOWER WORLD - Removed lilies as requested */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0">
                {/* Rain is now global via layout.tsx */}
            </div>

            {/* ENVELOPE CONTAINER */}
            <div className="letter-page-container">
                <div
                    className={`envelope-wrapper ${isOpen ? "open" : ""}`}
                    onClick={handleOpen}
                >
                    <div className="envelope">
                        <div className="front flap"></div>
                        <div className="front flap-left"></div>
                        <div className="front flap-right"></div>
                        <div className="front flap-bottom"></div>
                        <div className="heart"></div>
                        <div className="lid"></div>

                        <div className="letter-preview">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line short"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL LETTER OVERLAY */}
            <div className={`letter-overlay ${showLetter ? "visible" : ""}`}>
                <div className={`letter-paper ${showLetter ? "show" : ""}`}>
                    <button className="close-btn" onClick={handleClose}>&times;</button>
                    <div className="typewriter-text">
                        {letterContent.split('\n').map((line, i) => (
                            <p key={i} style={{ minHeight: '1em', marginBottom: '0.5em' }}>{line}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Back button */}
            <button
                onClick={goBack}
                className="absolute bottom-8 left-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>

        </div>
    );
}
