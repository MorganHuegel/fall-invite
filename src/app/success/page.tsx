import styles from "./success.module.css";
import Image from "next/image";

export default function SuccessPage() {
    return (
        <div className={styles.outerPage}>
            <Image
                width={300}
                height={300}
                src="/pumpkin_smiling.png"
                alt="pumpkin smiling"
            />
            <p>See you there!</p>
        </div>
    );
}
