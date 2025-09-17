"use client";

import style from "./invite.module.css";
import Leaf from "./components/leaf";

export default function LeafLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // `leafMultiplier` is "X" leaves per 100px of screen width
    const leafMultiplier = 1;
    // const numOfLeaves = Math.floor((window.innerWidth / 100) * leafMultiplier);
    const numOfLeaves = 20;

    let leaves = [];
    for (let n = 0; n < numOfLeaves; n++) {
        leaves.push(
            <Leaf
                src="/leaf_brown.png"
                alt="Brown leaf"
                initialLeft={
                    numOfLeaves === 1
                        ? "50%"
                        : `${Math.floor((n / numOfLeaves) * 100)}%`
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
