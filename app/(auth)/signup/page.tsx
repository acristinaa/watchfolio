import { SignupForm } from "@/components/auth/signupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Watchfolio",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Watchfolio 🎬</h1>
        <p className="text-muted-foreground mt-1">
          Your personal viewing tracker
        </p>
      </div>
      <SignupForm />
    </main>
  );
}
