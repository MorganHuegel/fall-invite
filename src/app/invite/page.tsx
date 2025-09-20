import Link from "next/link";
import Image from "next/image";
import DetailLine from "./components/detailLine";
import styles from "./invite.module.css";

export default function InvitePage() {
    return (
        <>
            <div className={styles.outerPage}>
                <p className={"cursive " + styles.invitedMsg}>
                    You&apos;re Invited
                </p>
                <div className={styles.tagline}>
                    <p className="frijole">Fall Celebration</p>
                    <Image
                        src="/pumpkin1.png"
                        alt="Pumpkin"
                        width={160}
                        height={135}
                        className={styles.pumpkin}
                    />
                    <Image
                        src="/cornucopia1.png"
                        alt="Cornucopia"
                        width={190}
                        height={130}
                        className={styles.cornucopia}
                    />
                </div>
                <ul className={styles.details}>
                    <DetailLine
                        question="Occasion:"
                        detail="Fall celebration with friends, food, and Autumn-themed games"
                    />
                    <DetailLine
                        question="When:"
                        detail="Sunday, October 12th @ 5pm"
                    />
                    <DetailLine
                        question="Location:"
                        detail={
                            <address className={styles.address}>
                                <p>836 Southpoint Crossing Drive</p>
                                <p>Durham, NC 27713</p>
                            </address>
                        }
                    />
                    <DetailLine
                        question="Dress:"
                        detail="Don't dress nicely - we'll be playing games outside!"
                    />
                    <DetailLine
                        question="Parking:"
                        detail="Ask Morgan about guest parking so you don't get towed :("
                    />
                </ul>
            </div>
            <div className={styles.rsvp}>
                <Link className={styles.link} href="/rsvp">
                    RSVP
                </Link>
            </div>
        </>
    );
}
