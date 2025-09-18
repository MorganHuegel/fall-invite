import styles from "./invite.module.css";
import DetailLine from "./components/detailLine";

export default function InvitePage() {
    return (
        <>
            <div className={styles.outerPage}>
                <p className={"cursive " + styles.invitedMsg}>
                    You&apos;re Invited
                </p>
                <p className={"frijole " + styles.tagline}>Fall Celebration</p>
                <ul className={styles.details}>
                    <DetailLine
                        question="Occasion:"
                        detail="A Fall celebration with friends, food, and games"
                    />
                    <DetailLine
                        question="When:"
                        detail="Sunday, October 12th @ 5pm"
                    />
                    <DetailLine
                        question="Location:"
                        detail={
                            <address>
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
                <a className={styles.link}>RSVP</a>
            </div>
        </>
    );
}
