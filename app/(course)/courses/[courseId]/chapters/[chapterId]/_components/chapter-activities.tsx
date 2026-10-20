"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle2, CircleHelp, ClipboardList, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type QuizQuestion = { id: string; prompt: string; options: string[]; explanation: string | null };
type QuizResult = { score: number; total: number; passed: boolean; passPercent: number; results: { correct: boolean; correctIndex: number; explanation?: string | null }[] };
type Submission = { response: string; status: string; score: number | null; feedback: string | null; submittedAt: string };

export function ChapterActivities({ courseId, chapterId, quiz, attempt, assignment, submission }: {
  courseId: string;
  chapterId: string;
  quiz: null | { id: string; title: string; passPercent: number; questions: QuizQuestion[] };
  attempt: null | { score: number; total: number; passed: boolean };
  assignment: null | { id: string; title: string; instructions: string };
  submission: null | Submission;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(quiz?.questions.map(() => null) ?? []);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizBusy, setQuizBusy] = useState(false);
  const [response, setResponse] = useState(submission?.response ?? "");
  const [savedSubmission, setSavedSubmission] = useState(submission);
  const [assignmentBusy, setAssignmentBusy] = useState(false);

  if (!quiz && !assignment) return null;

  const submitQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answers.some((answer) => answer === null)) return;
    setQuizBusy(true);
    try {
      const { data } = await axios.post("/api/courses/" + courseId + "/chapters/" + chapterId + "/quiz-attempt", { answers });
      setResult(data);
      toast.success(data.passed ? "Quiz passed!" : "Quiz submitted");
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data ?? "Could not submit quiz" : "Could not submit quiz");
    } finally { setQuizBusy(false); }
  };

  const submitAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAssignmentBusy(true);
    try {
      const { data } = await axios.post("/api/courses/" + courseId + "/chapters/" + chapterId + "/assignment", { response });
      setSavedSubmission({ ...data, response, score: null, feedback: null });
      toast.success("Assignment submitted");
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data ?? "Could not submit assignment" : "Could not submit assignment");
    } finally { setAssignmentBusy(false); }
  };

  return <section className="mx-auto max-w-4xl space-y-6 px-4 pb-10">
    {quiz && <form onSubmit={submitQuiz} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3"><CircleHelp className="mt-1 h-5 w-5 text-neutral-600" /><div><p className="eyebrow">Chapter quiz</p><h2 className="text-xl font-bold text-slate-900">{quiz.title}</h2><p className="mt-1 text-sm text-slate-500">Pass mark: {quiz.passPercent}% · {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}</p></div></div>
      {attempt && <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-900">Latest attempt: {attempt.score}/{attempt.total} correct · {attempt.passed ? "Passed" : "Not passed yet"}. You can retake the quiz.</p>}
      {quiz.questions.map((question, index) => <fieldset key={question.id} className="space-y-2 border-t border-slate-100 pt-4"><legend className="font-semibold text-slate-800">{index + 1}. {question.prompt}</legend>{question.options.map((option, optionIndex) => <label key={optionIndex} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm hover:border-neutral-300"><input type="radio" name={question.id} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? optionIndex : value))} className="accent-neutral-600" />{option}</label>)}
        {result && <p className={"text-sm font-medium " + (result.results[index].correct ? "text-emerald-700" : "text-rose-700")}>{result.results[index].correct ? "Correct" : "Review this question"}{result.results[index].explanation ? ": " + result.results[index].explanation : ""}</p>}
      </fieldset>)}
      {result && <p className={"rounded-lg p-3 text-sm font-bold " + (result.passed ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900")}>{result.score}/{result.total} correct · {result.passed ? "You passed!" : "Try again to reach " + result.passPercent + "%"}</p>}
      <Button disabled={quizBusy || answers.some((answer) => answer === null)} className="gap-2"><Send className="h-4 w-4" />{quizBusy ? "Submitting..." : result ? "Retake quiz" : "Submit quiz"}</Button>
    </form>}

    {assignment && <form onSubmit={submitAssignment} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3"><ClipboardList className="mt-1 h-5 w-5 text-neutral-600" /><div><p className="eyebrow">Chapter assignment</p><h2 className="text-xl font-bold text-slate-900">{assignment.title}</h2></div></div>
      <p className="whitespace-pre-line text-sm leading-6 text-slate-600">{assignment.instructions}</p>
      {savedSubmission?.status === "REVIEWED" && <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900"><p className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4" />Reviewed · Score {savedSubmission.score}/100</p>{savedSubmission.feedback && <p className="mt-2 whitespace-pre-line">{savedSubmission.feedback}</p>}</div>}
      {savedSubmission?.status === "SUBMITTED" && <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-900">Submitted. Your teacher will review your response.</p>}
      <Textarea value={response} onChange={(event) => setResponse(event.target.value)} minLength={10} maxLength={10000} placeholder="Write your response here..." required />
      <Button disabled={assignmentBusy || response.trim().length < 10} className="gap-2"><Send className="h-4 w-4" />{assignmentBusy ? "Submitting..." : savedSubmission ? "Update submission" : "Submit assignment"}</Button>
    </form>}
  </section>;
}
