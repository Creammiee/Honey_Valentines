"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeGame } from "@/lib/progress";

const size = 3;

export default function Game3() {
    const router = useRouter();
    const [tiles, setTiles] = useState<number[]>([]);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        let arr = [...Array(size * size).keys()];
        do {
            arr = arr.sort(() => Math.random() - 0.5);
        } while (!isSolvable(arr));
        setTiles(arr);
    }, []);

    const isSolvable = (arr: number[]) => {
        let inv = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] !== 8 && arr[j] !== 8 && arr[i] > arr[j]) inv++;
            }
        }
        return inv % 2 === 0;
    };

    const move = (i: number) => {
        if (!started) return;

        const empty = tiles.indexOf(8);
        const valid = [empty - 1, empty + 1, empty - 3, empty + 3];

        if (valid.includes(i)) {
            const newTiles = [...tiles];
            [newTiles[i], newTiles[empty]] = [newTiles[empty], newTiles[i]];
            setTiles(newTiles);

            if (
                JSON.stringify(newTiles) ===
                JSON.stringify([...Array(9).keys()])
            ) {
                completeGame(3);
                router.push("/");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md text-2xl"
            >
                🏠
            </button>

            {!started ? (
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-4xl mb-6 font-bold text-pink-500">Sliding Puzzle</h1>
                    <p className="text-lg mb-8 opacity-80 leading-relaxed">
                        Unscramble the numbers to put them in order from 1 to 8.
                        <br /><br />
                        Click a tile next to the empty space to move it.
                    </p>
                    <button
                        onClick={() => setStarted(true)}
                        className="px-8 py-3 bg-pink-600 text-white rounded-full text-xl hover:scale-105 transition font-bold shadow-lg shadow-pink-500/30"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl mb-8 text-pink-500 font-bold">Order the tiles!</h2>
                    <div className="grid grid-cols-3 gap-2 bg-gray-900 p-4 rounded-xl shadow-2xl">
                        {tiles.map((tile, i) => (
                            <div
                                key={i}
                                onClick={() => move(i)}
                                className={`w-24 h-24 flex items-center justify-center text-white text-2xl font-bold rounded-lg cursor-pointer transition-transform active:scale-95 ${tile === 8
                                    ? "bg-transparent pointer-events-none"
                                    : "bg-gradient-to-br from-pink-500 to-pink-600 shadow-md"
                                    }`}
                            >
                                {tile !== 8 ? tile + 1 : ""}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}