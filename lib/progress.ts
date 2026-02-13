export const completeGame = (id: number) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(`game${id}`, "done");
    }
};

export const allCompleted = () => {
    if (typeof window === "undefined") return false;

    return (
        localStorage.getItem("game1") === "done" &&
        localStorage.getItem("game2") === "done" &&
        localStorage.getItem("game3") === "done"
    );
};