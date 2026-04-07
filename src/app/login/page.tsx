import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Log In — QuizMaker",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      {/* Suspense required because LoginForm reads useSearchParams() */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
