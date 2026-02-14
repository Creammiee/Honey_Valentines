"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { completeGame } from "@/lib/progress";

const SIZE = 30;

export default function Game2() {
    const router = useRouter();
    const gridRef = useRef<HTMLDivElement>(null);

    const [maze, setMaze] = useState<number[][]>([]);
    const [path, setPath] = useState<Set<string>>(new Set());
    const [drawing, setDrawing] = useState(false);
    const [started, setStarted] = useState(false);

    const start = [1, 1];
    const goal = [SIZE - 2, SIZE - 2];

    useEffect(() => {
        generateMaze();
    }, []);

    const generateMaze = () => {
        const grid = Array.from({ length: SIZE }, () =>
            Array(SIZE).fill(1)
        );

        const carve = (x: number, y: number) => {
            const dirs = [
                [2, 0],
                [-2, 0],
                [0, 2],
                [0, -2],
            ].sort(() => Math.random() - 0.5);

            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;

                if (
                    nx > 0 &&
                    ny > 0 &&
                    nx < SIZE - 1 &&
                    ny < SIZE - 1 &&
                    grid[ny][nx] === 1
                ) {
                    grid[ny - dy / 2][nx - dx / 2] = 0;
                    grid[ny][nx] = 0;
                    carve(nx, ny);
                }
            }
        };

        grid[start[1]][start[0]] = 0;
        carve(start[0], start[1]);

        grid[goal[1]][goal[0]] = 0;

        const gx = goal[0];
        const gy = goal[1];

        const neighbors = [
            [gx + 1, gy],
            [gx - 1, gy],
            [gx, gy + 1],
            [gx, gy - 1],
        ];

        const connected = neighbors.some(
            ([nx, ny]) =>
                nx >= 0 &&
                ny >= 0 &&
                nx < SIZE &&
                ny < SIZE &&
                grid[ny][nx] === 0
        );

        if (!connected && gx - 1 >= 0) {
            grid[gy][gx - 1] = 0;
        }

        setMaze(grid);
    };

    const handleEnter = (x: number, y: number) => {
        if (!drawing) return;
        if (maze[y][x] === 1) return;

        const key = `${x}-${y}`;
        setPath((prev) => new Set(prev).add(key));

        if (x === goal[0] && y === goal[1]) {
            completeGame(2);
            router.push("/");
        }
    };

    // 🔥 TOUCH SUPPORT
    const getCellFromTouch = (clientX: number, clientY: number) => {
        const rect = gridRef.current?.getBoundingClientRect();
        if (!rect) return null;

        const x = Math.floor(((clientX - rect.left) / rect.width) * SIZE);
        const y = Math.floor(((clientY - rect.top) / rect.height) * SIZE);

        if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) {
            return { x, y };
        }

        return null;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const cell = getCellFromTouch(touch.clientX, touch.clientY);
        if (!cell) return;

        if (cell.x === start[0] && cell.y === start[1]) {
            setDrawing(true);
            setPath(new Set([`${cell.x}-${cell.y}`]));
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!drawing) return;
        const touch = e.touches[0];
        const cell = getCellFromTouch(touch.clientX, touch.clientY);
        if (!cell) return;

        handleEnter(cell.x, cell.y);
    };

    const handleTouchEnd = () => {
        setDrawing(false);
    };

    if (maze.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white select-none">
            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md z-50"
            >
                🏠
            </button>

            {!started ? (
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-4xl mb-6 font-bold text-pink-500">
                        Love Maze
                    </h1>
                    <p className="text-lg mb-8 opacity-80 leading-relaxed">
                        Guide your path from the{" "}
                        <span className="text-pink-400 font-bold">
                            pink start
                        </span>{" "}
                        to the{" "}
                        <span className="text-green-400 font-bold">
                            green goal
                        </span>
                        .
                        <br />
                        <br />
                        Drag to draw your way through!
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
                    <h2 className="text-2xl mb-4 text-pink-500 font-bold">
                        Draw a path!
                    </h2>

                    <div
                        ref={gridRef}
                        className="grid touch-none"
                        style={{
                            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
                            width: "85vw",
                            maxWidth: "700px",
                        }}
                        onMouseUp={() => setDrawing(false)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {maze.map((row, y) =>
                            row.map((cell, x) => {
                                const key = `${x}-${y}`;
                                const isStart =
                                    x === start[0] && y === start[1];
                                const isGoal =
                                    x === goal[0] && y === goal[1];
                                const isPath = path.has(key);

                                return (
                                    <div
                                        key={key}
                                        className={`aspect-square
                  ${cell === 1
                                                ? "bg-gray-900"
                                                : isStart
                                                    ? "bg-pink-500"
                                                    : isGoal
                                                        ? "bg-green-500"
                                                        : isPath
                                                            ? "bg-purple-500"
                                                            : "bg-gray-600"
                                            }`}
                                        onMouseDown={() => {
                                            if (isStart) {
                                                setDrawing(true);
                                                setPath(new Set([key]));
                                            }
                                        }}
                                        onMouseEnter={() =>
                                            handleEnter(x, y)
                                        }
                                    />
                                );
                            })
                        )}
                    </div>

                    <p className="mt-6 text-sm opacity-70">
                        Drag from pink to green.
                    </p>
                </>
            )}
        </div>
    );
}