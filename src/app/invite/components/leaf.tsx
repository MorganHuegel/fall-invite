"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import style from "./leaf.module.css";

const INITIAL_STATE = {
    translateX: 0,
    translateY: -100,
    rotateX: 0,
    rotateY: 50,
    duration: 5000, // ms
    animationNumber: 1,
};

export default function Leaf({
    src,
    width,
    initialLeft,
    initialDelay,
}: Readonly<{
    src: string;
    width: number;
    initialLeft: string;
    initialDelay: number;
}>) {
    const [animationState, setAnimationState] = useState({
        ...INITIAL_STATE,
        duration: initialDelay,
    });
    const [isDone, setIsDone] = useState(false);

    function startAnimation() {
        const done = animationState.translateY > window.innerHeight + 100;

        if (done) {
            setIsDone(true);
        } else {
            setAnimationState(prev => {
                const speed = Math.floor(Math.random() * 100) + 200; // 200-300 px/sec
                let duration = Math.random() * 4 + 2; // 2-6 sec
                duration = Math.round(duration * 1000) / 1000; // round to 3 decimal places

                /* we want somewhat constant speed,
                 * so if duration is high, make sure distance is high
                 * if duration is low, make sure distance is proportionally low
                 *
                 * Speed=Distance/Time, so Distance=Speed*Time
                 */

                const translateYFurther = speed * duration;

                return {
                    ...prev,
                    translateX: Math.floor(
                        prev.translateX + (Math.random() * 500 - 250) // between -250px and 250px
                    ),
                    translateY: prev.translateY + translateYFurther,
                    rotateX: Math.floor(Math.random() * 1000),
                    rotateY: Math.floor(Math.random() * 1000),
                    duration: duration * 1000,
                    animationNumber: prev.animationNumber + 1,
                };
            });
        }
    }

    useEffect(() => {
        if (!isDone) {
            setTimeout(startAnimation, animationState.duration);
        }
        /* this Timeout is also triggered on page load,
         * so first leaf drop is after initialDuration
         */
    }, [animationState, isDone]);

    useEffect(() => {
        if (isDone) {
            setAnimationState({
                ...INITIAL_STATE,
                duration: 0,
                translateY: -600,
            });

            /* start over again right away, but need slight delay
             *  so no race condition with setAnimationState right above
             */
            setTimeout(() => {
                setIsDone(false);
            }, 1000);
        }
    }, [isDone]);

    return (
        <span
            className={style.translateLeaf}
            style={{
                left: initialLeft,
                transform: `translateX(${animationState.translateX}px) translateY(${animationState.translateY}px)`,
                transition: isDone
                    ? "none"
                    : `transform ${animationState.duration}ms linear`,
            }}
        >
            <Image
                src={src}
                style={{
                    transform: `rotateX(${animationState.rotateX}deg) rotateY(${animationState.rotateY}deg)`,
                    transition: isDone
                        ? "none"
                        : `transform ${animationState.duration}ms linear`,
                }}
                alt="leaf"
                width={width}
                height={width} // all images are almost squares
            />
        </span>
    );
}
