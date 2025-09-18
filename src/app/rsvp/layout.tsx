import styles from "./rsvp.module.css";

export default function RsvpLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <div className={styles.layout}>{children}</div>;
}
