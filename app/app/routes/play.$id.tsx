import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getList } from "~/models/quiz.server";

import type { Quiz, List } from "@prisma/client";
import 'bootstrap/dist/css/bootstrap.min.css';

export const loader: LoaderFunction = async ({ params }) => {
  const list = await getList(parseInt(params.id || "", 10));
  if (!list) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ list });
};

export default function PlayQuiz() {
  const { list } = useLoaderData<{ list: List & { quizzes: Quiz[] } }>();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizzes, setQuizzes] = useState(list.quizzes);
  const navigate = useNavigate();

  const currentQuiz = quizzes[currentQuizIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStarClick = async () => {
    // クイズの isChecked 状態を更新するためのAPI呼び出し
    const response = await fetch(`/api/quizzes/${currentQuiz.id}/toggle-check`, {
      method: "POST",
    });

    if (response.ok) {
      // フロントエンドでの状態反映
      const updatedQuizzes = quizzes.map((quiz, index) =>
        index === currentQuizIndex
          ? { ...quiz, isChecked: !quiz.isChecked }
          : quiz
      );
      setQuizzes(updatedQuizzes);
    } else {
      console.error("Failed to toggle isChecked state");
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setIsFlipped(false);
    } else {
      navigate("/"); // 最後の問題の場合、/へリダイレクト
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="content container">
      <h3>{list.name}</h3>
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title">問題 {currentQuizIndex + 1}/{quizzes.length}</h5>
          <p className="card-text" style={{ minHeight: '100px' }}>
            {isFlipped ? currentQuiz.answer : currentQuiz.problem}
          </p>
          <div className="text-end">
            <button className="btn btn-secondary me-2" onClick={handleFlip}>
              ひっくり返す
            </button>
            <button
              className={`btn ${currentQuiz.isChecked ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={handleStarClick}
            >
              ★
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={handlePrevious}
          disabled={currentQuizIndex === 0}
        >
          前のカードへ
        </button>
        {currentQuizIndex < quizzes.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
          >
            次のカードへ
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => navigate("/")}
          >
            学習を完了
          </button>
        )}
      </div>
    </div>
  );
}