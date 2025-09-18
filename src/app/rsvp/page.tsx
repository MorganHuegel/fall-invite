"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./rsvp.module.css";

const LOCAL_STORAGE_RSVP_KEY = "fall_invite_rsvp";
const LOCAL_STORAGE_NAME_KEY = "fall_invite_name";
const LOCAL_STORAGE_GUESTS_KEY = "fall_invite_guests";
const LOCAL_STORAGE_ITEMS_TO_BRING_KEY = "fall_invite_items_to_bring";

// will come from server
const stuffToBring = [
    {
        name: "Drink (alcoholic)",
        required: 2,
        claimed: 2,
    },
    {
        name: "Drink (non-alcoholic)",
        required: 2,
        claimed: 0,
    },
    {
        name: "Dessert",
        required: 5,
        claimed: 1,
    },
    {
        name: "Side dish/snack",
        required: 5,
        claimed: 2,
    },
    {
        name: "Paper plates",
        required: 1,
        claimed: 1,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
    {
        name: "Plastic utensils",
        required: 1,
        claimed: 0,
    },
];

export default function RsvpPage() {
    const [fallYellowHex, setFallYellowHex] = useState("#ffffff");
    const [isAttending, setIsAttending]: [Boolean | null, Function] =
        useState(null);
    const [currPage, setCurrPage]: [number, Function] = useState(1);
    const [visiblePages, setVisiblePages]: [Array<number>, Function] = useState(
        [1]
    );
    const [nameInput, setNameInput]: [string, Function] = useState("");
    const [guestsInput, setGuestsInput]: [number | string, Function] =
        useState("");
    const [itemsToBring, setItemsToBring]: [Array<string>, Function] = useState(
        []
    );

    const [downButtonTransition, setDownButtonTransition]: [boolean, Function] =
        useState(false);

    const page2Ref = useRef<HTMLDivElement>(null);
    const page3Ref = useRef<HTMLDivElement>(null);

    // Wait to do client-side stuff in useEffect, so we know it's in Browser and not on server
    useEffect(() => {
        if (typeof window !== "undefined") {
            setFallYellowHex(
                window
                    .getComputedStyle(document.body)
                    .getPropertyValue("--fallYellow")
            );

            let existingRsvp = window.localStorage.getItem(
                LOCAL_STORAGE_RSVP_KEY
            );
            setIsAttending(
                typeof existingRsvp === "string"
                    ? existingRsvp === "true"
                    : null
            );

            let existingName = window.localStorage.getItem(
                LOCAL_STORAGE_NAME_KEY
            );
            setNameInput(existingName || "");

            let existingGuests = window.localStorage.getItem(
                LOCAL_STORAGE_GUESTS_KEY
            );
            setGuestsInput(existingGuests ? parseInt(existingGuests, 10) : 1);

            let existingItemsToBring = window.localStorage.getItem(
                LOCAL_STORAGE_ITEMS_TO_BRING_KEY
            );
            setItemsToBring(
                existingItemsToBring ? JSON.parse(existingItemsToBring) : []
            );
        }
    }, []);

    useEffect(() => {
        if (currPage === 2 && page2Ref?.current) {
            page2Ref.current.scrollIntoView({ behavior: "smooth" });
        } else if (currPage === 3 && page3Ref?.current) {
            page3Ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [page2Ref?.current, page3Ref?.current, currPage]);

    useEffect(() => {
        if (downButtonTransition) {
            setTimeout(() => setDownButtonTransition(false), 500);
        } else {
            setTimeout(() => setDownButtonTransition(true), 4500);
        }
    }, [downButtonTransition]);

    // Validate all pages
    useEffect(() => {
        if (!isAttending) {
            setVisiblePages([1]);
        } else if (!nameInput || !guestsInput) {
            setVisiblePages([1, 2]);
        } else {
            setVisiblePages([1, 2, 3]);
        }
    }, [isAttending, nameInput, guestsInput]);

    function clickIsAttending(bool: Boolean) {
        setIsAttending(bool);
        window.localStorage.setItem(LOCAL_STORAGE_RSVP_KEY, String(bool));
        // backend request to update database
        if (bool) {
            setCurrPage(2);
        }
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        setNameInput(val);
        window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY, val);
    }

    function handleGuestChange(event: React.ChangeEvent<HTMLInputElement>) {
        let val = parseInt(event.target.value, 10);
        if (val && Number.isNaN(val)) {
            val = 1;
        }

        setGuestsInput(val);
        window.localStorage.setItem(LOCAL_STORAGE_GUESTS_KEY, String(val));
    }

    function toggleItemToBring(name: string) {
        if (itemsToBring.includes(name)) {
            setItemsToBring((prev: Array<string>) => {
                const next = prev.filter(x => x !== name);
                localStorage.setItem(
                    LOCAL_STORAGE_ITEMS_TO_BRING_KEY,
                    JSON.stringify(next)
                );
                return next;
            });
        } else {
            setItemsToBring((prev: Array<string>) => {
                const next = [...prev, name];
                localStorage.setItem(
                    LOCAL_STORAGE_ITEMS_TO_BRING_KEY,
                    JSON.stringify(next)
                );
                return next;
            });
        }
    }

    function renderDownButton(nextPage: number) {
        if (!visiblePages.includes(nextPage)) {
            return null;
        }

        let thisStyles = downButtonTransition
            ? {
                  transform: "translateY(20px)",
                  boxShadow: `0 0 18px ${fallYellowHex}`,
                  backgroundColor: fallYellowHex,
              }
            : {
                  transform: "translateY(0px)",
                  boxShadow: `0 0 0 ${fallYellowHex}`,
                  backgroundColor: "rgba(255, 255, 255, 0)",
              };

        return (
            <button
                type="button"
                onClick={() => setCurrPage(nextPage)}
                className={styles.downPage}
                style={thisStyles}
            >
                <Image src="/down.svg" alt="down" width={40} height={40} />
            </button>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.page1} id="page1">
                <p className={styles.attendingMsg}>Will you be attending?</p>
                <span
                    className={`${styles.yes} ${
                        isAttending === true ? styles.highlight : ""
                    }`}
                >
                    <button
                        onClick={() => clickIsAttending(true)}
                        className={`cursive ${styles.rsvpButton} ${
                            isAttending === false ? styles.disabled : ""
                        }`}
                    >
                        Yes
                    </button>
                </span>
                <span
                    className={`${styles.no} ${
                        isAttending === false ? styles.highlight : ""
                    }`}
                >
                    <button
                        onClick={() => clickIsAttending(false)}
                        className={`cursive ${styles.rsvpButton} ${
                            isAttending === true ? styles.disabled : ""
                        }`}
                    >
                        No
                    </button>
                </span>
                {isAttending === false && (
                    <p className={styles.notAttendingMessage}>
                        Sorry to hear that!
                        <span className={styles.emoji}>😢</span>
                        You can change your reservation at any time.
                    </p>
                )}
                {renderDownButton(2)}
            </div>

            {isAttending === true && (
                <div className={styles.page2} ref={page2Ref}>
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        name="name"
                        value={nameInput}
                        id="name"
                        onChange={handleNameChange}
                        className={styles.input}
                    />

                    <label htmlFor="guests" className={styles.label}>
                        Guests
                    </label>
                    <input
                        name="guests"
                        value={guestsInput}
                        type="number"
                        id="guests"
                        onChange={handleGuestChange}
                        className={styles.input}
                    />

                    {renderDownButton(3)}
                </div>
            )}

            {isAttending === true &&
                nameInput !== "" &&
                !!guestsInput &&
                !Number.isNaN(guestsInput) && (
                    <div className={styles.page3} ref={page3Ref}>
                        <p className={styles.bring}>
                            Would you like to bring anything?
                        </p>
                        <p className={styles.bringTagLine}>
                            It's not expected but always appreciated!
                        </p>
                        <ul className={styles.itemsToBring}>
                            {stuffToBring
                                .sort((a, b) => {
                                    const isAClaimed = a.claimed >= a.required;
                                    const isBClaimed = b.claimed >= b.required;
                                    if (isAClaimed && !isBClaimed) {
                                        return 1;
                                    } else if (isBClaimed && !isAClaimed) {
                                        return -1;
                                    }
                                    return 0;
                                })
                                .map((item, i) => {
                                    const isChecked = itemsToBring.includes(
                                        item.name
                                    );

                                    const isClaimedByOther =
                                        !isChecked &&
                                        item.claimed >= item.required;

                                    return (
                                        <li
                                            key={item.name + i}
                                            className={`${styles.item} ${
                                                isClaimedByOther
                                                    ? styles.claimed
                                                    : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                disabled={isClaimedByOther}
                                                className={styles.checkbox}
                                                checked={isChecked}
                                                onChange={() =>
                                                    toggleItemToBring(item.name)
                                                }
                                            />
                                            <label htmlFor={item.name}>
                                                {item.name}
                                                {isClaimedByOther && (
                                                    <span>
                                                        &nbsp;(already taken)
                                                    </span>
                                                )}
                                            </label>
                                        </li>
                                    );
                                })}
                        </ul>
                        <p className={styles.itemRecap}>
                            You volunteered to bring:{" "}
                            <b>{itemsToBring.join(", ")}</b>
                        </p>
                        <div className={styles.submit}>
                            <button>Submit</button>
                        </div>
                    </div>
                )}
        </div>
    );
}
