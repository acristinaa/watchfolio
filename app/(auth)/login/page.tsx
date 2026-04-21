import { LoginForm } from "@/components/auth/loginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Watchfolio",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Watchfolio</h1>
      </div>
      <LoginForm />
    </main>
  );
}
