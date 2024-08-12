import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { addList } from "~/models/quiz.server";
import 'bootstrap/dist/css/bootstrap.min.css';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length === 0) {
    return json({ error: "リスト名を入力してください。" }, { status: 400 });
  }

  await addList(name);
  return redirect("/");
};

export default function CreateList() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <div className="content container">
      <h3>問題集を新規作成</h3>
      <Form method="post" className="form-group">
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
        <button type="submit" className="btn btn-primary">作成</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/")}
        >
          キャンセル
        </button>
      </Form>
    </div>
  );
}