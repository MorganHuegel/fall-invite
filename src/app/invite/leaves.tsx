"use client";

import { useState, useEffect } from "react";
import Leaf from "./components/leaf";
import { leafOptions } from "./layout";
import styles from "./invite.module.css";

export default function Leaves() {
    // `leafMultiplier` is "X" leaves per 100px of screen width
    const leafMultiplier = 5;
    const numOfLeaves =
        typeof window === "undefined"
            ? 0
            : Math.floor((window.innerWidth / 100) * leafMultiplier);

    const [leaves, setLeaves] = useState<React.ReactNode[]>([]);
    useEffect(() => {
        const leafList: React.ReactNode[] = [];
        for (let n = 0; n < numOfLeaves; n++) {
            const src =
                leafOptions[Math.floor(Math.random() * leafOptions.length)];
            const width = Math.round(Math.random() * 30) + 20;

            leafList.push(
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

        setLeaves(leafList);
    }, [numOfLeaves]);

    return <div className={styles.leafContainer}>{leaves}</div>;
}
