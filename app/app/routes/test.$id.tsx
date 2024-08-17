import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getList, toggleQuizChecked } from "~/models/quiz.server";

import type { Quiz, List } from "@prisma/client";
import 'bootstrap/dist/css/bootstrap.min.css';

export const loader: LoaderFunction = async ({ params }) => {
  const list = await getList(parseInt(params.id || "", 10));
  if (!list) {
    throw new Response("Not Found", { status: 404 });
  }

  // クイズをランダムにシャッフル
  const shuffledQuizzes = list.quizzes.sort(() => 0.5 - Math.random());
  
  return json({ list: { ...list, quizzes: shuffledQuizzes } });
};

export default function TestQuiz() {
  const { list } = useLoaderData<{ list: List & { quizzes: Quiz[] } }>();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const navigate = useNavigate();

  const currentQuiz = list.quizzes[currentQuizIndex];

  // 出題数に応じて選択肢の数を決定（5問以下なら2択、それ以上なら4択）
  const numChoices = list.quizzes.length <= 5 ? 2 : 4;

  // 選択肢を生成する関数
  const generateChoices = (correctQuiz: Quiz, allQuizzes: Quiz[], numChoices: number): Quiz[] => {
    const incorrectChoices = allQuizzes
      .filter(quiz => quiz.id !== correctQuiz.id) // 正解以外のクイズ
      .filter((quiz, index, self) => self.findIndex(q => q.answer === quiz.answer) === index) // 重複する回答を排除
      .sort(() => 0.5 - Math.random()) // ランダムに並び替える
      .slice(0, numChoices - 1); // 選択肢の数に合わせる

    // 正解の選択肢と間違いの選択肢を合成しシャッフル
    const allChoices = [correctQuiz, ...incorrectChoices].sort(() => 0.5 - Math.random());
    return allChoices;
  };

  const [shuffledAnswers, setShuffledAnswers] = useState<Quiz[]>(() => generateChoices(currentQuiz, list.quizzes, numChoices));

  useEffect(() => {
    setShuffledAnswers(generateChoices(currentQuiz, list.quizzes, numChoices));
  }, [currentQuizIndex]);

  const handleAnswerClick = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === currentQuiz.answer) {
      setCorrectCount(correctCount + 1);
    } else {
      // 不正解ならフラグを付ける
      await fetch(`/api/quizzes/${currentQuiz.id}/toggle-check`, {
        method: "POST",
      });
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < list.quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      navigate(`/result/${list.id}`, {
        state: { correctCount, totalCount: list.quizzes.length },
      });
    }
  };

  return (
    <div className="content container text-center">
      <h3>{list.name} - 確認テスト</h3>
      <div className="card mt-5">
        <div className="card-header">
          <h5>問題 {currentQuizIndex + 1}/{list.quizzes.length}</h5>
        </div>
        <div className="card-body">
          <p className="card-text" style={{ minHeight: '100px' }}>
            {currentQuiz.problem}
          </p>
          <div className="row justify-content-center mt-3">
            {shuffledAnswers.map((quiz, index) => (
              <div key={index} className="col-6 mb-2">
                <button
                  className={`btn btn-block w-100 ${selectedAnswer ? (quiz.answer === currentQuiz.answer ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
                  onClick={() => handleAnswerClick(quiz.answer)}
                  disabled={showResult}
                >
                  {quiz.answer}
                </button>
              </div>
            ))}
          </div>
          {showResult && (
            <div className="mt-3">
              <div className={`alert ${selectedAnswer === currentQuiz.answer ? 'alert-success' : 'alert-danger'}`}>
                {selectedAnswer === currentQuiz.answer ? '正解！' : '不正解！'}
              </div>
              <button className="btn btn-primary" onClick={handleNext}>
                {currentQuizIndex < list.quizzes.length - 1 ? "次の問題へ" : "結果を見る"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}