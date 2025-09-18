import styles from "./detailLine.module.css";

export default function DetailLine({
    question,
    detail,
}: Readonly<{
    question: string;
    detail: string | React.ReactNode;
}>) {
    return (
        <li className={styles.detailLine}>
            <span className={styles.question}>{question}</span>
            <b>{detail}</b>
        </li>
    );
}
