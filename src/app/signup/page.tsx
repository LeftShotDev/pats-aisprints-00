import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up — QuizMaker",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <SignupForm />
    </main>
  );
}
