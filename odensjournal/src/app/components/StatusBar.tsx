"use client";

import { useState, useEffect } from "react";

export default function StatusBar() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            );
        };
        update();
        const id = setInterval(update, 30_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="status-bar">
            <div className="status-left">
                <span className="status-accent">⎇ main</span>
                <span className="status-item">
                    <span className="icon">◈</span> journal
                </span>
                <span className="status-item">
                    <span className="icon">⚡</span> sqlite
                </span>
            </div>
            <div className="status-right">
                <span className="status-item">UTF-8</span>
                <span className="status-item">LF</span>
                <span className="status-item">{time}</span>
            </div>
        </div>
    );
}
