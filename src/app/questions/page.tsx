import { Header } from "@/components/layout/header";
import { QuestionLibrary } from "@/components/questions/QuestionLibrary";

export const metadata = {
  title: "My Questions — QuizMaker",
};

export default function QuestionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <QuestionLibrary />
      </main>
    </div>
  );
}
