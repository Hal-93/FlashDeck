import { useLocation, useNavigate } from "@remix-run/react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { correctCount, totalCount } = location.state || { correctCount: 0, totalCount: 0 };

  const handleRetry = () => {
    // ユーザーが再試行する場合、元のクイズリストに戻る
    navigate(-1);  // 前のページに戻る
  };

  const handleGoToHome = () => {
    // ホームページに戻る
    navigate("/");
  };

  const successRate = Math.round((correctCount / totalCount) * 100);

  return (
    <div className="content container text-center mt-5">
      <h2>テスト結果</h2>
      <div className="card mt-5">
        <div className="card-body">
          <h3>{correctCount} / {totalCount} 問正解</h3>
          <p>正解率: {successRate}%</p>
          {successRate === 100 ? (
            <p className="text-success">素晴らしい！全問正解です！</p>
          ) : successRate >= 80 ? (
            <p className="text-primary">よくできました！もう少しで満点です。</p>
          ) : successRate >= 50 ? (
            <p className="text-warning">頑張りましたが、もう少し復習が必要です。</p>
          ) : (
            <p className="text-danger">まだまだ練習が必要ですね。再挑戦しましょう！</p>
          )}
          <div className="mt-4">
            <button className="btn btn-primary me-3" onClick={handleRetry}>
              もう一度挑戦
            </button>
            <button className="btn btn-secondary" onClick={handleGoToHome}>
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}