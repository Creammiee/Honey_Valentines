"use client";

import React, { useEffect, useState } from 'react';

export default function Rain() {
    // Determine if we should mount (client-side only to avoid hydration mismatch with random values)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="rain-container">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="rain-drop" style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 3 + 4}s`, // Slower fall 
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${Math.random() * 1.5 + 1}rem`
                }}>
                    {Math.random() > 0.5 ? '🌸' : '❤️'}
                </div>
            ))}
        </div>
    );
}
