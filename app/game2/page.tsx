"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { completeGame } from "@/lib/progress";

const SIZE = 25;
const CELL = 24;
const MOVE_THRESHOLD = 30; // how far to drag before moving

export default function Game2() {
    const router = useRouter();

    const [maze, setMaze] = useState<number[][]>([]);
    const [player, setPlayer] = useState({ x: 1, y: 1 });

    const dragStart = useRef<{ x: number; y: number } | null>(null);
    const dragDelta = useRef({ x: 0, y: 0 });

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

        grid[1][1] = 0;
        carve(1, 1);
        grid[goal[1]][goal[0]] = 0;

        setMaze(grid);
        setPlayer({ x: 1, y: 1 });
    };

    const tryMove = (dx: number, dy: number) => {
        const newX = player.x + dx;
        const newY = player.y + dy;

        if (
            newX < 0 ||
            newY < 0 ||
            newX >= SIZE ||
            newY >= SIZE
        )
            return;

        if (maze[newY][newX] === 1) return;

        setPlayer({ x: newX, y: newY });

        if (newX === goal[0] && newY === goal[1]) {
            completeGame(2);
            router.push("/");
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        dragStart.current = { x: e.clientX, y: e.clientY };
        dragDelta.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragStart.current) return;

        dragDelta.current.x += e.movementX;
        dragDelta.current.y += e.movementY;

        if (Math.abs(dragDelta.current.x) > MOVE_THRESHOLD) {
            if (dragDelta.current.x > 0) tryMove(1, 0);
            else tryMove(-1, 0);
            dragDelta.current.x = 0;
        }

        if (Math.abs(dragDelta.current.y) > MOVE_THRESHOLD) {
            if (dragDelta.current.y > 0) tryMove(0, 1);
            else tryMove(0, -1);
            dragDelta.current.y = 0;
        }
    };

    const handlePointerUp = () => {
        dragStart.current = null;
        dragDelta.current = { x: 0, y: 0 };
    };

    if (!maze.length) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white touch-none">
            <h2 className="mb-4 text-pink-500 font-bold">
                Drag to Guide the Love ❤️
            </h2>

            <div
                className="relative"
                style={{
                    width: SIZE * CELL,
                    height: SIZE * CELL,
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {maze.map((row, y) =>
                    row.map((cell, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`absolute ${cell === 1
                                ? "bg-gray-900"
                                : x === goal[0] && y === goal[1]
                                    ? "bg-green-500"
                                    : "bg-gray-600"
                                }`}
                            style={{
                                width: CELL,
                                height: CELL,
                                left: x * CELL,
                                top: y * CELL,
                            }}
                        />
                    ))
                )}

                <div
                    className="absolute bg-pink-500 rounded-full shadow-lg shadow-pink-500/60"
                    style={{
                        width: CELL * 0.7,
                        height: CELL * 0.7,
                        left: player.x * CELL + CELL * 0.15,
                        top: player.y * CELL + CELL * 0.15,
                        transition: "left 0.08s linear, top 0.08s linear",
                    }}
                />
            </div>
        </div>
    );
}