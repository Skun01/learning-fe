import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle,
  Lightning,
  Brain,
  Info,
  Warning,
  CardsThree,
  X,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { learnService } from "@/services/learnService";
import { getErrorMessage } from "@/types/api";
import type { LearnBatchDTO, LearnCardDTO } from "@/types/learn";

type CardState = "viewing" | "marked";

interface CardLearnState {
  card: LearnCardDTO;
  state: CardState;
  isMastered: boolean;
}

export function LearnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deckId = searchParams.get("deckId");

  const [batch, setBatch] = useState<LearnBatchDTO | null>(null);
  const [cardStates, setCardStates] = useState<CardLearnState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "examples">("details");

  const loadBatch = useCallback(async () => {
    if (!deckId) return;
    setIsLoading(true);
    try {
      const res = await learnService.getLearnBatch(deckId);
      if (res.data.success) {
        const data = res.data.data;
        setBatch(data);
        setCardStates(
          data.cards.map((card) => ({
            card,
            state: "viewing",
            isMastered: false,
          }))
        );
        setCurrentIndex(0);
        setShowDetails(false);
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể tải bài học");
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadBatch();
  }, [loadBatch]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && currentIndex < cardStates.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === "Escape") {
        navigate("/dashboard");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, cardStates.length, navigate]);

  if (!deckId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Brain className="h-16 w-16 text-muted-foreground/30 animate-float" />
        <p className="text-muted-foreground">Chưa chọn bộ thẻ để học</p>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-primary hover:underline cursor-pointer">
          ← Quay về trang chủ
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin-smooth h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!batch || cardStates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <CheckCircle className="h-16 w-16 text-emerald-500/50 animate-float" weight="fill" />
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">Không còn thẻ mới!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Bạn đã học hết thẻ mới trong bộ này. Hãy ôn tập hoặc chọn bộ thẻ khác.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const current = cardStates[currentIndex];
  const card = current.card;
  const allMarked = cardStates.every((cs) => cs.state === "marked");
  const markedCount = cardStates.filter((cs) => cs.state === "marked").length;
  const progressPercent = (markedCount / cardStates.length) * 100;

  async function handleMark(isMastered: boolean) {
    setIsMarking(true);
    try {
      const res = await learnService.markCardLearned({
        cardId: card.cardId,
        cardType: card.cardType,
        isMastered,
      });
      if (res.data.success) {
        setCardStates((prev) =>
          prev.map((cs, i) =>
            i === currentIndex ? { ...cs, state: "marked", isMastered } : cs
          )
        );
        toast.success(isMastered ? "Đã đánh dấu thành thạo ⭐" : "Đã đánh dấu đã học ✓");
        if (currentIndex < cardStates.length - 1) {
          setTimeout(() => setCurrentIndex((prev) => prev + 1), 400);
        }
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể đánh dấu thẻ");
    } finally {
      setIsMarking(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-30 bg-primary text-white">
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
              <p className="text-xs text-white/60 truncate">
                {batch.deckName} · {card.cardType === "Vocabulary" ? "Từ vựng" : "Ngữ pháp"}
              </p>
              <p className="text-sm font-semibold truncate">
                Thẻ {currentIndex + 1}/{cardStates.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/50">Hôm nay</p>
              <p className="text-sm font-bold tabular-nums">
                {(batch.dailyProgress.learnedToday + markedCount)}/{batch.dailyProgress.dailyGoal}
              </p>
            </div>
            <MagnifyingGlass className="h-5 w-5 text-white/40 cursor-pointer hover:text-white/70 transition-colors hidden sm:block" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: progressPercent >= 100
                ? "linear-gradient(90deg, #34d399, #10b981)"
                : "linear-gradient(90deg, #60a5fa, #a78bfa)",
            }}
          />
        </div>
      </header>

      {/* ===== Card area ===== */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 pb-32 px-4">
        <div className="w-full max-w-3xl animate-fade-in-up">
          {/* Term + Meaning */}
          <div className="text-center mb-8">
            <h1
              className={`font-bold text-foreground mb-2 ${
                card.cardType === "Grammar" ? "text-3xl sm:text-4xl text-destructive" : "text-4xl sm:text-5xl"
              }`}
            >
              {card.term}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{card.meaning}</p>

            {/* Caution (inline, like Bunpro) */}
            {card.caution && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-lg">
                <Warning className="h-4 w-4 shrink-0" weight="fill" />
                <span>{card.caution}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-8 justify-center">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Chi tiết
              </button>
              <button
                onClick={() => setActiveTab("examples")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "examples"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Ví dụ {card.hasExamples ? `(${card.examples.length})` : ""}
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {activeTab === "details" ? (
              <>
                {/* Details content — left 2 cols */}
                <div className="sm:col-span-2 space-y-4">
                  {card.structure && (
                    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-5">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        Cấu trúc <Info className="h-3 w-3" />
                      </p>
                      <p className="text-sm font-medium text-foreground whitespace-pre-wrap">{card.structure}</p>
                    </div>
                  )}
                  {card.explanation && (
                    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-5">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Giải thích</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{card.explanation}</p>
                    </div>
                  )}
                  {!card.structure && !card.explanation && (
                    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-8 text-center">
                      <p className="text-sm text-muted-foreground">Không có chi tiết bổ sung</p>
                    </div>
                  )}
                </div>

                {/* Action buttons — right 1 col */}
                <div className="space-y-3">
                  {current.state === "viewing" ? (
                    <>
                      <button
                        onClick={() => handleMark(true)}
                        disabled={isMarking}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-destructive/30 text-destructive px-4 py-3 text-sm font-semibold hover:bg-destructive/5 active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Star className="h-4 w-4" weight="fill" />
                        Đánh dấu thành thạo
                      </button>
                    </>
                  ) : (
                    <div
                      className={`w-full text-center py-3 rounded-xl text-sm font-medium ${
                        current.isMastered
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {current.isMastered ? "⭐ Đã thành thạo" : "✓ Đã đánh dấu học"}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Examples tab — full width */
              <div className="sm:col-span-3 space-y-3">
                {!card.hasExamples || card.examples.length === 0 ? (
                  <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-8 text-center">
                    <CardsThree className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">Thẻ này chưa có ví dụ</p>
                  </div>
                ) : (
                  card.examples.map((ex, i) => (
                    <div
                      key={ex.id}
                      className={`animate-fade-in-up stagger-${i + 1} bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-4`}
                    >
                      <p className="text-sm font-medium text-foreground">{ex.clozeSentence}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                          {ex.expectedAnswer}
                        </span>
                        {ex.hint && (
                          <span className="text-xs text-muted-foreground">💡 {ex.hint}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===== Bottom bar ===== */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-white/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Nav dots */}
          <div className="flex items-center gap-1">
            {cardStates.map((cs, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? "w-6 bg-primary"
                    : cs.state === "marked"
                      ? cs.isMastered
                        ? "w-2 bg-amber-400"
                        : "w-2 bg-emerald-400"
                      : "w-2 bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {allMarked ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all cursor-pointer"
              >
                <Lightning className="h-4 w-4" weight="fill" />
                Hoàn thành!
              </button>
            ) : current.state === "viewing" ? (
              <button
                onClick={() => handleMark(false)}
                disabled={isMarking}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                Tiếp <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(cardStates.length - 1, prev + 1))}
                disabled={currentIndex === cardStates.length - 1}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                Tiếp <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
