import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  X,
  ArrowRight,
  Eye,
  EyeSlash,
  CheckCircle,
  XCircle,
  Lightning,
  ArrowsClockwise,
  Ghost,
  CardsThree,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { reviewService } from "@/services/reviewService";
import { getErrorMessage } from "@/types/api";
import type { ReviewSessionDTO, ReviewItemDTO, ReviewResultDTO } from "@/types/learn";

type ItemState = "answering" | "result";

interface ReviewItemState {
  item: ReviewItemDTO;
  state: ItemState;
  userAnswer: string;
  result: ReviewResultDTO | null;
}

export function ReviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deckId = searchParams.get("deckId");
  const inputRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<ReviewSessionDTO | null>(null);
  const [itemStates, setItemStates] = useState<ReviewItemState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const loadSession = useCallback(async () => {
    if (!deckId) return;
    setIsLoading(true);
    try {
      const res = await reviewService.getReviewSession(deckId);
      if (res.data.success) {
        const data = res.data.data;
        setSession(data);
        setItemStates(
          data.items.map((item) => ({
            item,
            state: "answering",
            userAnswer: "",
            result: null,
          }))
        );
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể tải phiên ôn tập");
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Focus input when switching cards
  useEffect(() => {
    if (inputRef.current && itemStates[currentIndex]?.state === "answering") {
      inputRef.current.focus();
    }
  }, [currentIndex, itemStates]);

  // Keyboard: Esc to exit
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") navigate("/dashboard");
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (!deckId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <ArrowsClockwise className="h-16 w-16 text-muted-foreground/30 animate-float" />
        <p className="text-muted-foreground">Chưa chọn bộ thẻ để ôn tập</p>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-primary hover:underline cursor-pointer">
          ← Quay về trang chủ
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin-smooth h-10 w-10 border-4 border-destructive border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session || itemStates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <CheckCircle className="h-16 w-16 text-emerald-500/50 animate-float" weight="fill" />
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">Không có thẻ cần ôn tập!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tất cả thẻ trong bộ này đang ổn. Quay lại sau nhé!
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all cursor-pointer"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const allDone = itemStates.every((is) => is.state === "result");
  const doneCount = itemStates.filter((is) => is.state === "result").length;
  const progressPercent = (doneCount / itemStates.length) * 100;
  const current = itemStates[currentIndex];
  const item = current.item;

  async function handleSubmitCloze() {
    if (!current.userAnswer.trim()) {
      toast.error("Vui lòng nhập câu trả lời");
      return;
    }
    await submitReview(current.userAnswer.trim());
  }

  async function handleFlashcardSelfAssess(isCorrect: boolean) {
    await submitReview(undefined, isCorrect);
  }

  async function submitReview(userAnswer?: string, selfAssessCorrect?: boolean) {
    setIsSubmitting(true);
    try {
      const res = await reviewService.submitReview({
        cardProgressId: item.cardProgressId,
        exampleSentenceId: item.exampleSentenceId ?? undefined,
        userAnswer,
        isCorrect: selfAssessCorrect,
        isGhost: false,
      });
      if (res.data.success) {
        const result = res.data.data;
        setItemStates((prev) =>
          prev.map((is, i) =>
            i === currentIndex ? { ...is, state: "result", result } : is
          )
        );
        if (result.isCorrect) {
          setCorrectCount((c) => c + 1);
        } else {
          setIncorrectCount((c) => c + 1);
        }
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể gửi kết quả");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (currentIndex < itemStates.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  }

  function handleInputChange(value: string) {
    setItemStates((prev) =>
      prev.map((is, i) =>
        i === currentIndex ? { ...is, userAnswer: value } : is
      )
    );
  }

  // SRS level label
  function getSrsLabel(level: number) {
    if (level <= 1) return { text: "Mới", color: "text-red-500" };
    if (level <= 3) return { text: "Đang học", color: "text-orange-500" };
    if (level <= 5) return { text: "Khá", color: "text-blue-500" };
    return { text: "Thành thạo", color: "text-emerald-500" };
  }

  // Completion screen
  if (allDone) {
    const accuracy = doneCount > 0 ? Math.round((correctCount / doneCount) * 100) : 0;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-fade-in-up px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <Lightning className="h-20 w-20 mx-auto text-amber-400" weight="fill" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hoàn thành ôn tập!</h1>
            <p className="text-muted-foreground mt-1">{session.deckName}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{doneCount}</p>
              <p className="text-xs text-muted-foreground">Tổng</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-4">
              <p className="text-2xl font-bold text-emerald-600">{correctCount}</p>
              <p className="text-xs text-emerald-600">Đúng</p>
            </div>
            <div className="bg-red-50 border border-red-200/60 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
              <p className="text-xs text-red-600">Sai</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-5">
            <p className="text-sm text-muted-foreground mb-2">Độ chính xác</p>
            <p className={`text-4xl font-bold ${accuracy >= 80 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-red-600"}`}>
              {accuracy}%
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${accuracy >= 80 ? "bg-emerald-500" : accuracy >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all cursor-pointer"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-30 bg-destructive text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Thoát (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-white/60 truncate">{session.deckName}</p>
              <p className="text-sm font-semibold">
                Ôn tập {currentIndex + 1}/{itemStates.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-300 font-bold tabular-nums">{correctCount}</span>
              <span className="text-white/30">/</span>
              <span className="text-red-300 font-bold tabular-nums">{incorrectCount}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/15 h-1">
          <div
            className="h-full bg-white/50 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-16 pb-32 px-4">
        <div className="w-full max-w-2xl animate-fade-in-up">
          {/* SRS level badge */}
          <div className="flex justify-center mb-6">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-muted ${getSrsLabel(item.srsLevel).color}`}>
              SRS {item.srsLevel} · {getSrsLabel(item.srsLevel).text}
            </span>
          </div>

          {item.reviewType === "Cloze" ? (
            /* ── CLOZE MODE ── */
            <div className="space-y-8">
              {/* Cloze sentence */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl p-8 text-center">
                <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                  {item.clozeSentence}
                </p>
                {item.hint && (
                  <p className="text-sm text-muted-foreground mt-3">💡 {item.hint}</p>
                )}
              </div>

              {/* Card info */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{item.cardTerm}</strong> — {item.cardMeaning}
                </p>
              </div>

              {current.state === "answering" ? (
                /* Input */
                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={current.userAnswer}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmitCloze();
                    }}
                    placeholder="Nhập câu trả lời..."
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-3.5 text-center text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={isSubmitting}
                    autoFocus
                  />
                  <button
                    onClick={handleSubmitCloze}
                    disabled={isSubmitting || !current.userAnswer.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Đang kiểm tra..." : "Kiểm tra"}
                  </button>
                </div>
              ) : (
                /* Result */
                <ResultFeedback result={current.result!} userAnswer={current.userAnswer} />
              )}
            </div>
          ) : (
            /* ── FLASHCARD MODE ── */
            <div className="space-y-8">
              {/* Card front */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl p-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {item.cardTerm}
                </h2>

                {showAnswer ? (
                  <div className="animate-fade-in-up">
                    <div className="border-t border-border/50 pt-4 mt-4">
                      <p className="text-xl text-muted-foreground">{item.cardMeaning}</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-2 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Hiện đáp án
                  </button>
                )}
              </div>

              {current.state === "answering" ? (
                showAnswer ? (
                  /* Self-assessment buttons */
                  <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                    <button
                      onClick={() => handleFlashcardSelfAssess(false)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 px-4 py-3.5 text-sm font-semibold hover:bg-red-100 active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle className="h-5 w-5" weight="fill" />
                      Chưa nhớ
                    </button>
                    <button
                      onClick={() => handleFlashcardSelfAssess(true)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3.5 text-sm font-semibold hover:bg-emerald-100 active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle className="h-5 w-5" weight="fill" />
                      Đã nhớ
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Nhấn "Hiện đáp án" rồi tự đánh giá
                  </p>
                )
              ) : (
                /* Result */
                <ResultFeedback result={current.result!} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* ===== Bottom bar ===== */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-white/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex items-center gap-1 flex-wrap max-w-[50%]">
            {itemStates.map((is, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setShowAnswer(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? "w-6 bg-destructive"
                    : is.state === "result"
                      ? is.result?.isCorrect
                        ? "w-2 bg-emerald-400"
                        : "w-2 bg-red-400"
                      : "w-2 bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          {current.state === "result" && (
            <button
              onClick={handleNext}
              disabled={currentIndex === itemStates.length - 1 && !allDone}
              className="inline-flex items-center gap-2 bg-destructive text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all cursor-pointer"
            >
              {currentIndex === itemStates.length - 1 ? "Xem kết quả" : "Tiếp"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

/* ── Result feedback component ── */
function ResultFeedback({ result, userAnswer }: { result: ReviewResultDTO; userAnswer?: string }) {
  const srsLabel = result.newSrsLevel <= 1 ? "Mới" : result.newSrsLevel <= 3 ? "Đang học" : result.newSrsLevel <= 5 ? "Khá" : "Thành thạo";

  return (
    <div className={`rounded-2xl p-6 space-y-3 animate-fade-in-up ${
      result.isCorrect
        ? "bg-emerald-50 border-2 border-emerald-200"
        : "bg-red-50 border-2 border-red-200"
    }`}>
      <div className="flex items-center gap-2">
        {result.isCorrect ? (
          <>
            <CheckCircle className="h-6 w-6 text-emerald-600" weight="fill" />
            <span className="text-lg font-bold text-emerald-700">Chính xác!</span>
          </>
        ) : (
          <>
            <XCircle className="h-6 w-6 text-red-600" weight="fill" />
            <span className="text-lg font-bold text-red-700">Chưa đúng</span>
          </>
        )}
      </div>

      {!result.isCorrect && result.expectedAnswer && (
        <div className="space-y-1">
          {userAnswer && (
            <p className="text-sm text-red-600">
              Bạn trả lời: <span className="line-through">{userAnswer}</span>
            </p>
          )}
          <p className="text-sm text-foreground">
            Đáp án: <strong className="text-emerald-700">{result.expectedAnswer}</strong>
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
        <span>SRS → {result.newSrsLevel} ({srsLabel})</span>
        {result.nextReviewAt && (
          <span>
            Ôn lại: {new Date(result.nextReviewAt).toLocaleDateString("vi-VN")}
          </span>
        )}
        {result.isGhostEligible && (
          <span className="inline-flex items-center gap-1 text-violet-600">
            <Ghost className="h-3 w-3" weight="fill" /> Ghost
          </span>
        )}
      </div>
    </div>
  );
}
