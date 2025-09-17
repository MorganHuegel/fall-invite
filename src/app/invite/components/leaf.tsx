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
    alt,
    initialLeft,
}: Readonly<{ src: string; alt: string; initialLeft: string }>) {
    const [animationState, setAnimationState] = useState(INITIAL_STATE);
    const [isDone, setIsDone] = useState(false);

    function startAnimation() {
        const done = animationState.translateY > window.innerHeight + 100;

        if (done) {
            setIsDone(true);
        } else {
            setAnimationState(prev => {
                return {
                    ...prev,
                    translateX: Math.floor(
                        prev.translateX + (Math.random() * 300 - 150) // between -150px and 150px
                    ),
                    translateY: Math.floor(
                        prev.translateY + (Math.random() * 600 - 30) // between -30px and 570px
                    ),
                    rotateX: Math.floor(Math.random() * 1000),
                    rotateY: Math.floor(Math.random() * 1000),
                    duration: Math.floor(Math.random() * 4000) + 2000,
                    animationNumber: prev.animationNumber + 1,
                };
            });
        }
    }

    useEffect(() => {
        startAnimation();
    }, []);

    useEffect(() => {
        if (!isDone) {
            setTimeout(startAnimation, animationState.duration);
        }
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
            }, 100);
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
                alt={alt}
                width={50}
                height={50}
            />
        </span>
    );
}
