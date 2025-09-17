import type { Metadata } from "next";
import "./globals.css";

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
            <body>{children}</body>
        </html>
    );
}
