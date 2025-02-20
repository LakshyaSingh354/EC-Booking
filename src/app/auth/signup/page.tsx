"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		// Send the user data to your signup API
		const res = await fetch("/next/next/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, password }),
		});

		const data = await res.json();

		if (res.ok) {
			// Redirect to sign-in page after successful signup
			router.push("/auth/signin");
		} else {
			// Show error message if signup fails
			setError(data.error || "Something went wrong. Please try again.");
		}
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
				<h1 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
					Sign Up
				</h1>
				<form onSubmit={handleSignUp} className="my-8">
					<div className="flex flex-col space-y-2 mb-4">
						<LabelInputContainer>
							<Label htmlFor="name">Name</Label>
							<Input
								type="text"
								name="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="John Doe"
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="password">Password</Label>
							<Input
								type="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
							/>
						</LabelInputContainer>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<button
						type="submit"
						className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					>
						Sign up &rarr;
					</button>
				</form>
				<button
					className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
					onClick={() => signIn("google")}
				>
					<IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
					<span className="text-neutral-700 dark:text-neutral-300 text-sm">
						Continue with Google
					</span>
					<BottomGradient />
				</button>
			</div>
			<button
				onClick={() => (window.location.href = "/auth/signin")}
				className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
			>
				Already have an account? Sign in
			</button>
		</div>
	);
}

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col space-y-2 w-full", className)}>
			{children}
		</div>
	);
};

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input
		className="border-2 border-gray-300 dark:border-gray-700 rounded-md p-2"
		{...props}
	/>
);

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const Label = ({
	children,
	...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
	<label
		{...props}
		className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
	>
		{children}
	</label>
);
