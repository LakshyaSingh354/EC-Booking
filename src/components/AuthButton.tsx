"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CustomUser {
  id: string;
  _id: string; // Add MongoDB _id
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
interface ExtendedUser extends CustomUser {
  role: "user" | "consultant";
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export default function AuthButton() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const router = useRouter();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  function handleSignIn(role: "user" | "consultant") {
    localStorage.setItem("authRole", role); // Store in case needed later
    document.cookie = `authRole=${role}; path=/;`;
	  signIn("google");
  }

  // Redirect user based on role after login
  // useEffect(() => {
  //   if (session) {
  //     if (session.user!.role === "consultant") {
  //       router.push("https://ec-booking-django.onrender.com/myadmin/");
  //     }
  //   }
  // }, [session, router]);

  return (
    <div>
        <div>
          <button onClick={() => handleSignIn("consultant")} className="shadow-lg bg-gray-200 p-4">Sign in as Consultant</button>

          {showRoleSelection && (
            <div className="modal">
              <p>Are you signing in as a:</p>
              <button onClick={() => handleSignIn("user")}>User</button>
              <button onClick={() => handleSignIn("consultant")}>Consultant</button>
            </div>
          )}
        </div>
    </div>
  );
}
