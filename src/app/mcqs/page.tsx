import { Header } from "@/components/layout/header";

export const metadata = {
  title: "My Questions — QuizMaker",
};

export default function McqsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">My Questions</h1>
        <p className="text-muted-foreground">
          Your question library is coming soon.
        </p>
      </main>
    </div>
  );
}
