"use client";

import style from "./invite.module.css";
import Leaf from "./components/leaf";

const leafOptions = [
    "/leaf_brown.png",
    "/leaf_orange.png",
    "/leaf_yellow.png",
    "/leaf_red.png",
];

export default function LeafLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // `leafMultiplier` is "X" leaves per 100px of screen width
    const leafMultiplier = 5;
    // const leafMultiplier = 0;
    const numOfLeaves = Math.floor((window.innerWidth / 100) * leafMultiplier);

    let leaves: React.ReactNode[] = [];
    for (let n = 0; n < numOfLeaves; n++) {
        const src = leafOptions[Math.floor(Math.random() * leafOptions.length)];
        const width = Math.round(Math.random() * 30) + 20;

        leaves.push(
            <Leaf
                src={src}
                width={width}
                initialLeft={
                    numOfLeaves === 1
                        ? "50%"
                        : `${Math.floor((n / numOfLeaves) * 100)}%`
                }
                initialDelay={
                    Math.floor(Math.random() * 10000) // between 0-10 sec
                }
                key={n}
            />
        );
    }

    return (
        <div className={style.leafContainer}>
            {leaves}
            {children}
        </div>
    );
}
