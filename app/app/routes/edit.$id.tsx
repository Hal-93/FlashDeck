import { useState } from "react";
import { useLoaderData, useNavigate, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getList, updateList, updateQuiz, addQuiz } from "~/models/quiz.server";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Quiz, List } from "@prisma/client";

export const loader: LoaderFunction = async ({ params }) => {
  const list = await getList(parseInt(params.id || "", 10));
  if (!list) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ list });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length === 0) {
    return json({ error: "リスト名を入力してください。" }, { status: 400 });
  }

  const quizzes = [];
  let index = 0;

  while (formData.has(`problem_${index}`)) {
    const problem = formData.get(`problem_${index}`) as string;
    const answer = formData.get(`answer_${index}`) as string;
    const id = formData.get(`id_${index}`) as string;
    const isChecked = formData.get(`isChecked_${index}`) === "true";

    quizzes.push({ id, problem, answer, isChecked });
    index++;
  }

  // 空のクイズが含まれている場合、エラーメッセージを返す
  if (quizzes.some(quiz => !quiz.problem || !quiz.answer)) {
    return json({ error: "空のクイズを保存できません。" }, { status: 400 });
  }

  // リスト名の更新
  await updateList(parseInt(params.id || "", 10), name);

  // クイズの追加と更新
  for (const quiz of quizzes) {
    if (quiz.id && quiz.id !== "0") {
      // 既存クイズの更新
      await updateQuiz(parseInt(quiz.id), quiz.problem, quiz.answer, quiz.isChecked);
    } else {
      // 新規クイズの追加
      await addQuiz(quiz.problem, quiz.answer, parseInt(params.id || "", 10));
    }
  }

  return redirect("/");
};

export default function EditList() {
  const { list } = useLoaderData<{ list: List & { quizzes: Quiz[] } }>();
  const [quizzes, setQuizzes] = useState(list.quizzes);
  const [name, setName] = useState(list.name);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addEmptyQuiz = () => {
    if (quizzes.some(quiz => !quiz.problem || !quiz.answer)) {
      setError("すべての設問に問題文と解答を入力してください。");
      return;
    }
    setQuizzes([...quizzes, { id: 0, problem: "", answer: "", listId: list.id, isChecked: false }]);
    setError(null); // エラーメッセージをクリア
  };

  const removeQuiz = (index: number) => {
    const updatedQuizzes = quizzes.filter((_, i) => i !== index);
    setQuizzes(updatedQuizzes);
  };

  const handleSubmit = (event: React.FormEvent) => {
    if (quizzes.some(quiz => !quiz.problem || !quiz.answer)) {
      event.preventDefault();
      setError("すべての設問に問題文と解答を入力してください。");
      return;
    }
    setError(null); // エラーメッセージをクリア
  };

  return (
    <div className="content container">
      <h3>問題集を編集</h3>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <br />
      <Form method="post" className="form-group" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">問題集の名前</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>問題文</th>
              <th>解答</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={index}>
                <input type="hidden" name={`id_${index}`} value={quiz.id} />
                <input type="hidden" name={`isChecked_${index}`} value={quiz.isChecked ? "true" : "false"} />
                <td>
                  <textarea
                    name={`problem_${index}`}
                    className="form-control"
                    value={quiz.problem}
                    onChange={(e) => {
                      const updatedQuizzes = [...quizzes];
                      updatedQuizzes[index].problem = e.target.value;
                      setQuizzes(updatedQuizzes);
                    }}
                  />
                </td>
                <td>
                  <textarea
                    name={`answer_${index}`}
                    className="form-control"
                    value={quiz.answer}
                    onChange={(e) => {
                      const updatedQuizzes = [...quizzes];
                      updatedQuizzes[index].answer = e.target.value;
                      setQuizzes(updatedQuizzes);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeQuiz(index)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={addEmptyQuiz}
        >
          + 設問を追加
        </button>
        <br />
        <br />
        <div className="text-end">
          <button type="submit" className="btn btn-success">更新</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/")}
          >
            キャンセル
          </button>
        </div>
      </Form>
    </div>
  );
}