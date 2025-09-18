import type { Metadata } from "next";
import "./globals.css";
import { Imperial_Script, Frijole } from "next/font/google";

const imperialScript = Imperial_Script({
    variable: "--font-cursive",
    weight: ["400"],
});

const frijole = Frijole({
    variable: "--font-frijole",
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "Invitation to Fall Celebration",
    description:
        "A gathering of friends to celebrate the coming of Fall. There will be food, drinks, games and prizes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${imperialScript.variable} ${frijole.variable}`}>
                {children}
            </body>
        </html>
    );
}
