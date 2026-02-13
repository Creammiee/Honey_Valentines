"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeGame } from "@/lib/progress";

export default function Game1() {
    const router = useRouter();

    const [sequence, setSequence] = useState<number[]>([]);
    const [player, setPlayer] = useState<number[]>([]);
    const [active, setActive] = useState<number | null>(null);
    const [round, setRound] = useState(1);

    const [started, setStarted] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [message, setMessage] = useState("Press Start when ready.");
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);

    const startGame = async () => {
        setStarted(true);
        setCountdown(3);
        setMessage("Get Ready...");

        for (let i = 3; i > 0; i--) {
            setCountdown(i);
            await new Promise((r) => setTimeout(r, 1000));
        }

        setCountdown(null);
        startRound([]);
    };

    const startRound = (currentSeq: number[]) => {
        const next = Math.floor(Math.random() * 4);
        const newSeq = [...currentSeq, next];

        setSequence(newSeq);
        setPlayer([]);
        setIsPlayingSequence(true);
        setMessage("Watch carefully...");

        playSequence(newSeq);
    };

    const playSequence = async (seq: number[]) => {
        for (let i = 0; i < seq.length; i++) {
            setActive(seq[i]);
            await new Promise((r) => setTimeout(r, 600));
            setActive(null);
            await new Promise((r) => setTimeout(r, 300));
        }

        setIsPlayingSequence(false);
        setMessage("Your turn.");
    };

    const handleClick = (i: number) => {
        if (isPlayingSequence || countdown !== null) return;

        setActive(i);
        setTimeout(() => setActive(null), 200);

        const newPlayer = [...player, i];
        setPlayer(newPlayer);

        if (sequence[newPlayer.length - 1] !== i) {
            setMessage("Wrong! Restarting...");
            setRound(1);
            setTimeout(() => {
                setStarted(false);
                setSequence([]);
                setPlayer([]);
                setMessage("Press Start when ready.");
            }, 1500);
            return;
        }

        if (newPlayer.length === sequence.length) {
            if (round === 5) {
                setMessage("You passed.");
                completeGame(1);
                setTimeout(() => router.push("/"), 1000);
            } else {
                setRound(round + 1);
                setTimeout(() => startRound(sequence), 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">

            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md text-2xl"
            >
                🏠
            </button>

            {!started ? (
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-4xl mb-6 font-bold text-pink-500">Memory Trial</h1>
                    <p className="text-lg mb-8 opacity-80 leading-relaxed">
                        Watch the sequence carefully.
                        <br />
                        Repeat it in the correct order.
                        <br />
                        Reach Round 5 to pass.
                    </p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-pink-600 text-white rounded-full text-xl hover:scale-105 transition font-bold shadow-lg shadow-pink-500/30"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    {countdown !== null ? (
                        <div className="text-6xl mb-6 text-pink-500 font-bold animate-pulse">{countdown}</div>
                    ) : (
                        <>
                            <h2 className="text-2xl mb-2 text-pink-500 font-bold">Round {round} / 5</h2>
                            <p className="mb-8 text-lg opacity-90">{message}</p>

                            <div className="grid grid-cols-2 gap-6">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleClick(i)}
                                        className={`w-32 h-32 rounded-2xl cursor-pointer transition-all duration-200 shadow-lg
                                            ${active === i
                                                ? "bg-pink-500 scale-105 shadow-pink-500/50"
                                                : "bg-gray-800 hover:bg-gray-700"
                                            }
                                        `}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>


    );
}