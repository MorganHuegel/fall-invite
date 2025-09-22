import Image from "next/image";
import styles from "./invite.module.css";

export const leafOptions = [
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
    return (
        <div>
            {/* preload so they render first on server-side, and client component can use cached files */}
            <div className={styles.preloadImages}>
                {[
                    ...leafOptions,
                    "/cornucopia1.png",
                    "/down.svg",
                    "/pumpkin_smiling.png",
                    "/pumpkin1.png",
                ].map((src, n) => (
                    <Image
                        src={src}
                        key={n}
                        alt="leaf"
                        height={10}
                        width={10}
                    />
                ))}
            </div>
            {children}
        </div>
    );
}
