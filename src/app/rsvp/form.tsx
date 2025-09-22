"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./rsvp.module.css";
import { redirect } from "next/navigation";

const LOCAL_STORAGE_GUEST_ID = "fall_invite_guest_id";

interface Item {
    id: number;
    name: string;
    max: number;
    claimed: number;
}

export default function RsvpPage({ items }: { items: Item[] }) {
    const [fallYellowHex, setFallYellowHex] = useState("#ffffff");
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [guestId, setGuestId] = useState<number | null>(null);
    const [isAttending, setIsAttending] = useState<boolean | null>(null);
    const [currPage, setCurrPage] = useState<number>(1);
    const [visiblePages, setVisiblePages] = useState<number[]>([1]);
    const [nameInput, setNameInput] = useState<string>("");
    const [attendeesInput, setAttendeesInput] = useState<number | string>("");
    const [itemsToBring, setItemsToBring] = useState<null | string[]>(null);
    const [downButtonTransition, setDownButtonTransition] =
        useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [itemList, setItemList] = useState<Item[]>(items);

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

            const existingUserId = window.localStorage.getItem(
                LOCAL_STORAGE_GUEST_ID
            );

            if (existingUserId) {
                setGuestId(Number(existingUserId));
            } else {
                (async function () {
                    const response = await fetch("/api/guest", {
                        method: "POST",
                    });
                    const data = await response.json();
                    window.localStorage.setItem(
                        LOCAL_STORAGE_GUEST_ID,
                        data.id
                    );
                    setGuestId(data.id);
                })();
            }
        }
    }, []);

    useEffect(() => {
        if (guestId) {
            (async function getUser() {
                const response = await fetch(`/api/guest/${guestId}`, {
                    method: "GET",
                });
                const data = await response.json();
                const {
                    isNew,
                    rsvp: existingRsvp,
                    name: existingName,
                    attendees: existingAttendees,
                    itemsToBring: existingItemsToBring,
                } = data;

                // handles case when an ID cached in local storage no longer exists on Prod database
                if (isNew) {
                    window.localStorage.setItem(
                        LOCAL_STORAGE_GUEST_ID,
                        data.id
                    );
                    setGuestId(data.id);
                    return;
                }

                if (typeof existingRsvp === "string") {
                    setIsAttending(existingRsvp === "true");
                } else if (typeof existingRsvp === "boolean") {
                    setIsAttending(existingRsvp);
                }

                setNameInput(existingName || "");
                setAttendeesInput(
                    existingAttendees ? parseInt(existingAttendees, 10) : 1
                );
                setItemsToBring(existingItemsToBring || []);
                setTimeout(() => setIsInitialLoading(false), 500);
            })();
        }
    }, [guestId]);

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

    useEffect(() => {
        if (isInitialLoading) {
            return;
        }

        if (!isAttending) {
            setVisiblePages([1]);
        } else if (!nameInput || !attendeesInput) {
            setVisiblePages([1, 2]);
        } else {
            setVisiblePages([1, 2, 3]);
        }
    }, [isInitialLoading, isAttending, nameInput, attendeesInput]);

    useEffect(() => {
        if (isInitialLoading && !isUpdating) {
            return;
        }

        if (isAttending === true || isAttending === false) {
            updateBackend();
        }
    }, [isAttending]);

    useEffect(() => {
        if (isInitialLoading && !isUpdating) {
            return;
        }

        updateBackend();
    }, [itemsToBring]);

    async function updateBackend() {
        if (!guestId || isInitialLoading || isUpdating) {
            return;
        }

        setIsUpdating(true);

        const resp = await fetch(`/api/guest/${guestId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rsvp: isAttending,
                name: nameInput,
                attendees: attendeesInput,
                itemsToBring,
            }),
        });
        const data = await resp.json();
        if (data.newItems) {
            setItemList(
                data.newItems.map((item: Item) => ({
                    ...item,
                    claimed: Number(item.claimed || 0),
                }))
            );
        }

        setIsUpdating(false);
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        setNameInput(val);
    }

    function handleAttendeesChange(event: React.ChangeEvent<HTMLInputElement>) {
        let val = parseInt(event.target.value, 10);
        if (val && Number.isNaN(val)) {
            val = 1;
        }

        setAttendeesInput(val);
    }

    function toggleItemToBring(name: string) {
        if (itemsToBring && itemsToBring.includes(name)) {
            setItemsToBring((prev: Array<string> | null) => {
                const next = Array.isArray(prev)
                    ? prev.filter(x => x !== name)
                    : null;
                return next;
            });
        } else {
            setItemsToBring((prev: Array<string> | null) => {
                const next = Array.isArray(prev) ? [...prev, name] : null;
                return next;
            });
        }
    }

    function handleSubmit() {
        setIsSubmitted(true);
    }

    function renderDownButton(nextPage: number) {
        if (!visiblePages.includes(nextPage)) {
            return null;
        }

        const thisStyles = downButtonTransition
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

    if (isInitialLoading) {
        return (
            <div className={styles.loader}>
                <Image
                    src="/leaf_brown.png"
                    alt="leaf"
                    width={50}
                    height={50}
                />
                <span>Loading...</span>
            </div>
        );
    }

    if (isSubmitted) {
        return redirect(`/success`);
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
                        onClick={() => setIsAttending(true)}
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
                        onClick={() => setIsAttending(false)}
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
                        onBlur={updateBackend}
                        className={styles.input}
                    />

                    <label htmlFor="attendees" className={styles.label}>
                        Attendees <span>(including yourself)</span>
                    </label>
                    <input
                        name="attendees"
                        value={
                            Number.isNaN(attendeesInput) ? "" : attendeesInput
                        }
                        type="number"
                        id="attendees"
                        onChange={handleAttendeesChange}
                        onBlur={updateBackend}
                        className={styles.input}
                    />

                    {renderDownButton(3)}
                </div>
            )}

            {isAttending === true &&
                nameInput !== "" &&
                !!attendeesInput &&
                !Number.isNaN(attendeesInput) && (
                    <div className={styles.page3} ref={page3Ref}>
                        <p className={styles.bring}>
                            Would you like to bring anything?
                        </p>
                        <p className={styles.bringTagLine}>
                            It&apos;s not expected but always appreciated!
                        </p>
                        <ul className={styles.itemsToBring}>
                            {itemList
                                .sort((a, b) => {
                                    const isAClaimed = a.claimed >= a.max;
                                    const isBClaimed = b.claimed >= b.max;
                                    if (isAClaimed && !isBClaimed) {
                                        return 1;
                                    } else if (isBClaimed && !isAClaimed) {
                                        return -1;
                                    }
                                    return a.name.localeCompare(b.name);
                                })
                                .map((item, i) => {
                                    const isChecked = itemsToBring
                                        ? itemsToBring.includes(item.name)
                                        : false;

                                    const isClaimed = item.claimed >= item.max;

                                    return (
                                        <li
                                            key={item.name + i}
                                            className={`${styles.item} ${
                                                isClaimed ? styles.claimed : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                disabled={
                                                    isClaimed && !isChecked
                                                }
                                                className={styles.checkbox}
                                                checked={isChecked}
                                                onChange={() =>
                                                    toggleItemToBring(item.name)
                                                }
                                            />
                                            <label htmlFor={item.name}>
                                                {item.name}
                                                {isClaimed && (
                                                    <span>&nbsp;(done)</span>
                                                )}
                                            </label>
                                        </li>
                                    );
                                })}
                        </ul>
                        {Array.isArray(itemsToBring) && itemsToBring.length ? (
                            <p className={styles.itemRecap}>
                                You volunteered to bring:{" "}
                                <b>{itemsToBring.join(", ")}</b>
                            </p>
                        ) : null}
                        <div className={styles.submit}>
                            <button onClick={handleSubmit} type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
}
