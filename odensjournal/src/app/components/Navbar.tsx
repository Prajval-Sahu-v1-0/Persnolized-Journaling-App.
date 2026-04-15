"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="navbar">
            <div className="nav-tabs">
                <Link
                    href="/"
                    className={`nav-tab ${pathname === "/" ? "active" : ""}`}
                >
                    <span className="dot" />
                    Journal
                </Link>
                <Link
                    href="/saved"
                    className={`nav-tab ${pathname === "/saved" ? "active" : ""}`}
                >
                    <span className="dot" />
                    Saved Journals
                </Link>
            </div>

            <div className="nav-spacer" />

            <div className="nav-title">oden@journal:~</div>
        </nav>
    );
}
