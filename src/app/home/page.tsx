"use client";

import { signIn, useSession } from "next-auth/react";

export default function HomePage() {
	const { data: session } = useSession();
	return session ? (
		<div className="flex flex-col justify-start items-center h-screen mt-5">
			<h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 flex justify-start items-start">
				Welcome {session.user?.name}!
			</h1>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded mt-5"
                onClick={() => window.location.href = '/events/new'}
            >
                Add New Event
            </button>
		</div>
	) : null;
}
