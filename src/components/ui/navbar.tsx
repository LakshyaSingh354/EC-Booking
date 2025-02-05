"use client";

import { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
	const [active, setActive] = useState<string | null>(null);
	return (
		<div
			className={cn(
				"fixed top-10 inset-x-0 max-w-2xl mx-auto z-50",
				className
			)}
		>
			<Menu setActive={setActive}>
				<Link href={"/events"}>
					<div>Events</div>
				</Link>
				<Link href={"/bookings"}>
					<div>Bookings</div>
				</Link>
				<Link href={"/events/new"}>
                    <div>New Event</div>
                </Link>
			</Menu>
		</div>
	);
}
