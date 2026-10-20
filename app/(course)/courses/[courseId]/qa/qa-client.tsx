"use client";

import { useState } from "react";
import axios from "axios";
import { MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AnswerItem = {
  id: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export type QuestionItem = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  answers: AnswerItem[];
};

export function CourseQA({ courseId, initialQuestions }: { courseId: string; initialQuestions: QuestionItem[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPending, setIsPending] = useState(false);

  const askQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    axios.post(`/api/courses/${courseId}/questions`, { title, body })
      .then(({ data }) => {
        setQuestions((current) => [{ ...data, createdAt: data.createdAt, updatedAt: data.updatedAt, answers: [] }, ...current]);
        setTitle("");
        setBody("");
        toast.success("Question posted");
      })
      .catch((error) => toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not post your question" : "Could not post your question"))
      .finally(() => setIsPending(false));
  };

  const reply = async (questionId: string, answerBody: string) => {
    setIsPending(true);
    try {
      const { data } = await axios.post(`/api/courses/${courseId}/questions/${questionId}/answers`, { body: answerBody });
      setQuestions((current) => current.map((question) => question.id === questionId ? { ...question, answers: [...question.answers, data] } : question));
      toast.success("Reply posted");
      return true;
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not post your reply" : "Could not post your reply");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={askQuestion} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Ask the course community</h2>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Question title" minLength={5} maxLength={160} required />
        <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add context so other learners can help..." minLength={10} maxLength={3000} required />
        <div className="flex justify-end"><Button disabled={isPending} className="gap-2"><Send className="h-4 w-4" />Post question</Button></div>
      </form>

      {questions.length ? questions.map((question) => (
        <QuestionCard key={question.id} question={question} disabled={isPending} onReply={(answer) => reply(question.id, answer)} />
      )) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center text-slate-500">
          <MessageCircle className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          No questions yet. Start the conversation.
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, disabled, onReply }: { question: QuestionItem; disabled: boolean; onReply: (body: string) => Promise<boolean> }) {
  const [answer, setAnswer] = useState("");
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-medium text-slate-500">{question.author} · {new Date(question.createdAt).toLocaleDateString()}</p>
      <h2 className="mt-2 text-lg font-bold text-slate-900">{question.title}</h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{question.body}</p>

      {question.answers.map((item) => (
        <div key={item.id} className="ml-3 mt-4 border-l-2 border-indigo-200 pl-4 sm:ml-6">
          <p className="text-xs font-medium text-indigo-700">{item.author} · {new Date(item.createdAt).toLocaleDateString()}</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{item.body}</p>
        </div>
      ))}

      <form onSubmit={async (event) => { event.preventDefault(); if (await onReply(answer)) setAnswer(""); }} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write a helpful reply..." minLength={2} maxLength={3000} required />
        <Button type="submit" variant="outline" disabled={disabled} className="shrink-0">Reply</Button>
      </form>
    </article>
  );
}
