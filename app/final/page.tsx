"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { allCompleted } from "@/lib/progress";

export default function Final() {
    const router = useRouter();

    useEffect(() => {
        if (!allCompleted()) router.push("/");
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100 text-center">
            <div>
                <h1 className="text-4xl mb-4">You Got The Key.</h1>
                <p>Now the heart can be unlocked.</p>
            </div>
        </div>
    );
}