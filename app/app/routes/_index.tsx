import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { getAllLists } from "~/models/quiz.server";
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/custom.css';
import type { List } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export const meta: MetaFunction = () => {
  return [
    { title: "FlashDeck" },
    { name: "description", content: "FlashDeck" },
  ];
};

export const loader: LoaderFunction = async () => {
  const lists = await getAllLists();
  return { lists };
};

type LoaderData = {
  lists: Array<List & { quizzes: { id: number }[] }>;
};

export default function Index() {
  const { lists } = useLoaderData<LoaderData>();

  return (
    <div className="content">
      <h3>問題集一覧</h3>
      <Link
        to={`/create`}
        className="btn btn-success me-2"
      >
        + 新規作成
      </Link>
      <br /><br />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>問題名</th>
            <th>設問数</th>
            <th></th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list: any) => (
            <tr key={list.id}>
              <td>{list.id}</td>
              <td>{list.name}</td>
              <td>{list.quizzes.length}</td>
              <td>
                <Link
                  to={`/play/${list.id}`}
                  className={`btn btn-primary me-2 ${list.quizzes.length === 0 ? "disabled" : ""}`}
                  aria-disabled={list.quizzes.length === 0}
                >
                  <FontAwesomeIcon icon={faPlayCircle} /> 学習
                </Link>
                <Link
                  to={`/flag/${list.id}`}
                  className={`btn btn-warning me-2 ${list.quizzes.length === 0 ? "disabled" : ""}`}
                  aria-disabled={list.quizzes.length === 0}
                >
                  <FontAwesomeIcon icon={faFlag} /> 反復
                </Link>
                <Link
                  to={`/test/${list.id}`}
                  className={`btn btn-success me-2 ${list.quizzes.length === 0 ? "disabled" : ""}`}
                  aria-disabled={list.quizzes.length === 0}
                >
                  <FontAwesomeIcon icon={faPencil} /> 確認テスト
                </Link>
              </td>
              <td>
              <Link
                  to={`/edit/${list.id}`}
                  className="btn btn-warning me-2"
                >
                  編集
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}