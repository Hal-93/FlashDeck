import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getList, toggleQuizChecked } from "~/models/quiz.server";

import type { Quiz, List } from "@prisma/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

export const loader: LoaderFunction = async ({ params }) => {
  const list = await getList(parseInt(params.id || "", 10));
  if (!list) {
    throw new Response("Not Found", { status: 404 });
  }

  // フラグ付きのクイズのみをフィルタリング
  const flaggedQuizzes = list.quizzes.filter(quiz => quiz.isChecked);
  
  return json({ list: { ...list, quizzes: flaggedQuizzes } });
};

export default function FlaggedQuizzes() {
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
    const response = await fetch(`/api/quizzes/${currentQuiz.id}/toggle-check`, {
      method: "POST",
    });

    if (response.ok) {
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
      navigate("/");
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFinishLearning = async () => {
    const confirmUnflagAll = window.confirm("すべてのフラグを解除しますか？");
    if (confirmUnflagAll) {
      // 全てのフラグを解除する
      for (const quiz of quizzes) {
        if (quiz.isChecked) {
          await fetch(`/api/quizzes/${quiz.id}/toggle-check`, {
            method: "POST",
          });
        }
      }
    }
    navigate("/");
  };

  // プログレスバーの進捗を計算
  const progressPercentage = ((currentQuizIndex + 1) / quizzes.length) * 100;

  return (
    <div className="content container">
      <h3>{list.name} - フラグ付きの問題</h3>
      {quizzes.length > 0 ? (
        <>
          <div className="card mt-5">
            <div className="card-header">
              <h5>{currentQuizIndex + 1}問目</h5>
            </div>
            <div className="card-body">
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
                  <FontAwesomeIcon icon={faFlag} />
                </button>
              </div>
            </div>
          </div>
          <br />
          <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${progressPercentage}%` }}
            ></div>
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
                onClick={handleFinishLearning}
              >
                学習を完了
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="alert alert-warning mt-5" role="alert">
          ここには、自分でフラグを登録したカードと確認テストで不正解だったカードが表示されます。
        </div>
      )}
    </div>
  );
}