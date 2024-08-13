import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { toggleQuizChecked } from "~/models/quiz.server";

export const action: ActionFunction = async ({ params }) => {
  const quizId = parseInt(params.id || "", 10);

  try {
    await toggleQuizChecked(quizId);
    return json({ success: true });
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return json({ error: errorMessage }, { status: 400 });
  }
};