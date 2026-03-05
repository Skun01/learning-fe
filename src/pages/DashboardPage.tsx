import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  CaretRight,
  GearSix,
  Plus,
  Trash,
  Brain,
  Fire,
  CardsThree,
  MagnifyingGlass,
  TrendUp,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { queueService } from "@/services/queueService";
import { learnService } from "@/services/learnService";
import { settingsService } from "@/services/settingsService";
import { deckService } from "@/services/deckService";
import { getErrorMessage } from "@/types/api";
import type { DeckQueueDTO, DailyProgressDTO, UserSettingsDTO } from "@/types/learn";
import type { DeckSummaryDTO } from "@/types/deck";

export function DashboardPage() {
  const [queue, setQueue] = useState<DeckQueueDTO[]>([]);
  const [allDecks, setAllDecks] = useState<DeckSummaryDTO[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgressDTO | null>(null);
  const [settings, setSettings] = useState<UserSettingsDTO | null>(null);
  const [totalDueReviews, setTotalDueReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [addingDeckId, setAddingDeckId] = useState<string | null>(null);
  const [removingDeckId, setRemovingDeckId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings form
  const [dailyGoal, setDailyGoal] = useState(10);
  const [batchSize, setBatchSize] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [queueRes, decksRes, progressRes, settingsRes] = await Promise.all([
        queueService.getQueue(),
        deckService.getDecks({ pageSize: 100 }),
        learnService.getDailyProgress(),
        settingsService.getSettings(),
      ]);

      if (queueRes.data.success) {
        const queueData = queueRes.data.data;
        setQueue(queueData);
        setTotalDueReviews(queueData.reduce((sum, q) => sum + q.dueForReview, 0));
      }
      if (decksRes.data.success) setAllDecks(decksRes.data.data);
      if (progressRes.data.success) setDailyProgress(progressRes.data.data);
      if (settingsRes.data.success) {
        const s = settingsRes.data.data;
        setSettings(s);
        setDailyGoal(s.dailyGoal);
        setBatchSize(s.batchSize);
      }
    } catch {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const queuedDeckIds = new Set(queue.map((q) => q.deckId));
  const availableDecks = allDecks.filter((d) => !queuedDeckIds.has(d.id));
  const filteredDecks = availableDecks.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAddToQueue(deckId: string) {
    setAddingDeckId(deckId);
    try {
      const res = await queueService.addToQueue({ deckId });
      if (res.data.success) {
        toast.success("Đã thêm vào hàng đợi");
        await loadData();
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể thêm vào hàng đợi");
    } finally {
      setAddingDeckId(null);
    }
  }

  async function handleRemoveFromQueue(deckId: string) {
    setRemovingDeckId(deckId);
    try {
      const res = await queueService.removeFromQueue(deckId);
      if (res.data.success) {
        toast.success("Đã xóa khỏi hàng đợi");
        await loadData();
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể xóa khỏi hàng đợi");
    } finally {
      setRemovingDeckId(null);
    }
  }

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      const res = await settingsService.updateSettings({ dailyGoal, batchSize });
      if (res.data.success) {
        toast.success("Đã lưu cài đặt");
        setShowSettingsModal(false);
        await loadData();
      } else {
        toast.error(getErrorMessage(res.data.message));
      }
    } catch {
      toast.error("Không thể lưu cài đặt");
    } finally {
      setIsSaving(false);
    }
  }

  const progressPercent = dailyProgress
    ? Math.min((dailyProgress.learnedToday / Math.max(dailyProgress.dailyGoal, 1)) * 100, 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin-smooth h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Streak banner */}
      {dailyProgress && dailyProgress.currentStreak > 0 && (
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/60 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
          <Fire className="h-4 w-4" weight="fill" />
          Chuỗi {dailyProgress.currentStreak} ngày liên tiếp 🔥
        </div>
      )}

      {/* ===== Learn + Review panels ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── NỘI DUNG HỌC (Left — 2 cols) ── */}
        <div className="lg:col-span-2 bg-primary rounded-2xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" weight="bold" />
              </div>
              <div>
                <h2 className="text-white text-lg font-bold leading-tight">Nội dung học</h2>
                <p className="text-white/50 text-xs">Mục tiêu hằng ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-white font-bold text-xl tabular-nums">
                  {dailyProgress?.learnedToday ?? 0}
                </span>
                <span className="text-white/40 text-sm font-medium">
                  {" "}/ {dailyProgress?.dailyGoal ?? 10}
                </span>
              </div>
              <CaretRight className="h-4 w-4 text-white/40" weight="bold" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-4">
            <div className="w-full bg-white/12 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent >= 100
                    ? "linear-gradient(90deg, #34d399, #10b981)"
                    : "linear-gradient(90deg, #60a5fa, #818cf8)",
                }}
              />
            </div>
          </div>

          {/* Queue items */}
          {queue.length === 0 ? (
            <div className="px-5 pb-6 pt-2 text-center">
              <p className="text-white/40 text-sm mb-3">Chưa có bộ thẻ nào trong hàng đợi</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" weight="bold" />
                Thêm bộ thẻ
              </button>
            </div>
          ) : (
            <>
              {queue.map((item, i) => (
                <div
                  key={item.deckId}
                  className={`animate-fade-in-up stagger-${i + 1} border-t border-white/8 px-5 py-3.5 flex items-center justify-between group hover:bg-white/5 transition-colors`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm truncate">
                        {item.deckName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          item.deckType === "Vocabulary"
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-violet-400/20 text-violet-300"
                        }`}
                      >
                        {item.deckType === "Vocabulary" ? "Từ vựng" : "Ngữ pháp"}
                      </span>
                    </div>
                    <div className="w-full bg-white/8 rounded-full h-1 mt-2 max-w-48">
                      <div
                        className="bg-white/35 h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.totalCards > 0 ? (item.learnedCards / item.totalCards) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 ml-4">
                    <span className="text-xs text-white/35 font-medium tabular-nums">
                      {item.learnedCards}/{item.totalCards}
                    </span>
                    <Link
                      to={`/learn?deckId=${item.deckId}`}
                      className="text-xs font-medium bg-white/12 text-white/90 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                    >
                      Học
                    </Link>
                    <button
                      onClick={() => handleRemoveFromQueue(item.deckId)}
                      disabled={removingDeckId === item.deckId}
                      className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition-all p-1 cursor-pointer"
                      title="Xóa khỏi hàng đợi"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="border-t border-white/8 px-5 py-3 flex items-center justify-between">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" weight="bold" />
                  Thêm bộ thẻ
                </button>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  title="Cài đặt"
                >
                  <GearSix className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── ÔN LUYỆN (Right — 1 col) ── */}
        <div className="lg:col-span-1 bg-destructive rounded-2xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg font-bold leading-tight">Ôn Luyện</h2>
              <p className="text-white/60 text-xs">Tất cả ôn tập</p>
            </div>
            <div className="bg-white/20 text-white font-bold text-xl px-4 py-1.5 rounded-xl min-w-[3rem] text-center tabular-nums">
              {totalDueReviews}
            </div>
          </div>

          {/* Review deck list */}
          {queue.length === 0 ? (
            <div className="px-5 pb-6 pt-2 text-center">
              <p className="text-white/50 text-sm">
                Thêm bộ thẻ để bắt đầu ôn tập
              </p>
            </div>
          ) : (
            <>
              {queue.map((item, i) => (
                <div
                  key={item.deckId}
                  className={`animate-fade-in-up stagger-${i + 1} border-t border-white/10 px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <CardsThree className="h-4 w-4 text-white/40 shrink-0" />
                    <span className="text-sm font-medium text-white/90 truncate">
                      {item.deckName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 ml-3">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        item.dueForReview > 0 ? "text-white" : "text-white/40"
                      }`}
                    >
                      {item.dueForReview}
                    </span>
                    {item.dueForReview > 0 && (
                      <Link
                        to={`/review?deckId=${item.deckId}`}
                        className="text-xs font-medium bg-white/15 text-white px-3 py-1.5 rounded-lg hover:bg-white/25 transition-all cursor-pointer"
                      >
                        Ôn
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {/* Total row */}
              <div className="border-t border-white/10 px-5 py-2.5 flex items-center justify-between">
                <span className="text-xs text-white/40">Tổng cần ôn</span>
                <span className="text-sm font-bold text-white tabular-nums">{totalDueReviews}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats row */}
      {settings && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <Fire className="h-4.5 w-4.5 text-orange-600" weight="fill" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chuỗi hiện tại</p>
              <p className="text-xl font-bold text-foreground">
                {settings.currentStreak} <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </p>
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendUp className="h-4.5 w-4.5 text-emerald-600" weight="bold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kỷ lục streak</p>
              <p className="text-xl font-bold text-foreground">
                {settings.longestStreak} <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </p>
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-xl border border-white/50 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-4.5 w-4.5 text-primary" weight="bold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ngày học cuối</p>
              <p className="text-base font-semibold text-foreground">
                {settings.lastStudyDate
                  ? new Date(settings.lastStudyDate).toLocaleDateString("vi-VN")
                  : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add to Queue Modal ===== */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm bộ thẻ vào hàng đợi</DialogTitle>
            <DialogDescription>
              Chọn bộ thẻ bạn muốn học. Bộ thẻ sẽ xuất hiện trên trang chủ.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm bộ thẻ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1.5 -mx-1 px-1">
            {filteredDecks.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-6">
                {availableDecks.length === 0
                  ? "Tất cả bộ thẻ đã có trong hàng đợi"
                  : "Không tìm thấy bộ thẻ"}
              </p>
            ) : (
              filteredDecks.map((deck) => (
                <div
                  key={deck.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{deck.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          deck.type === "Vocabulary"
                            ? "bg-theme-vocab-light text-theme-vocab"
                            : "bg-theme-grammar-light text-theme-grammar"
                        }`}
                      >
                        {deck.type === "Vocabulary" ? "Từ vựng" : "Ngữ pháp"}
                      </span>
                      <span className="text-xs text-muted-foreground">{deck.cardNumber} thẻ</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToQueue(deck.id)}
                    disabled={addingDeckId === deck.id}
                    className="ml-3 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:shadow-md active:brightness-95 p-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {addingDeckId === deck.id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" weight="bold" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Settings Modal ===== */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cài đặt học tập</DialogTitle>
            <DialogDescription>
              Tùy chỉnh mục tiêu hằng ngày và số thẻ mỗi batch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="modalDailyGoal">
                Mục tiêu hằng ngày (số thẻ mới)
              </label>
              <input
                id="modalDailyGoal"
                type="number"
                min={1}
                max={100}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground">
                Đạt mục tiêu mỗi ngày để duy trì streak.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="modalBatchSize">
                Batch size (số thẻ mỗi lần học)
              </label>
              <input
                id="modalBatchSize"
                type="number"
                min={1}
                max={50}
                value={batchSize}
                onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground">
                Số thẻ hiển thị mỗi lần vào trang học.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-md active:brightness-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}