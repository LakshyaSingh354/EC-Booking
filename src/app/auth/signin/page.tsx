"use client";
import { Input } from "@/components/signup-input";
import { Label } from "@/components/signup-label";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";



function SignIn() {
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
				<h1 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
					Sign In
				</h1>
				<form className="my-8" onSubmit={() => {}}>
					<div className="flex flex-col space-y-2 mb-4">
						<LabelInputContainer>
							<Label htmlFor="username">Username</Label>
							<Input
								type="text"
								name="username"
								placeholder="john"
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								placeholder="••••••••"
								type="password"
								name="password"
							/>
						</LabelInputContainer>
					</div>
					<button
						className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
						type="submit"
					>
						Sign in &rarr;
						<BottomGradient />
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
				onClick={() => (window.location.href = "/sign-up")}
				className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
			>
				Sign up instead
			</button>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};
export default function SignInPage() {
	return <SignIn />;
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
