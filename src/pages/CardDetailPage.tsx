import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUp,
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
  CaretDown as ChevronDown,
  Lightbulb,
  BookBookmark as BookType,
  BookOpen as BookA,
  PencilSimple as Pencil,
  Trash as Trash2,
  Check,
  X,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { EditCardDialog } from "@/components/deck/EditCardDialog";
import { DeleteCardDialog } from "@/components/deck/DeleteCardDialog";
import { AddExampleForm } from "@/components/deck/AddExampleForm";

import { deckService } from "@/services/deckService";
import { cardService } from "@/services/cardService";
import { getErrorMessage } from "@/types/api";
import type {
  DeckDTO,
  VocabularyCardDTO,
  GrammarCardDTO,
  ExampleSentenceDTO,
} from "@/types/deck";
import {
  createExampleSchema,
  type CreateExampleFormValues,
} from "@/lib/validations/deck";

export function CardDetailPage() {
  const { deckId, cardId } = useParams<{ deckId: string; cardId: string }>();
  const navigate = useNavigate();
  const { open: sidebarOpen } = useSidebar();

  const [deck, setDeck] = useState<DeckDTO | null>(null);
  const [vocabCard, setVocabCard] = useState<VocabularyCardDTO | null>(null);
  const [grammarCard, setGrammarCard] = useState<GrammarCardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"details" | "examples">(
    "details"
  );
  const [showFloatingUI, setShowFloatingUI] = useState(false);

  // Edit / Delete dialogs
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Section refs for scroll-to
  const heroRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const isManualScroll = useRef(false);

  const fetchData = useCallback(async () => {
    if (!deckId || !cardId) return;
    setIsLoading(true);
    try {
      const deckRes = await deckService.getDeck(deckId);
      const deckData = deckRes.data.data;
      setDeck(deckData);

      if (deckData.type === "Vocabulary") {
        const cardRes = await cardService.getVocabularyCard(cardId);
        setVocabCard(cardRes.data.data);
        setGrammarCard(null);
      } else {
        const cardRes = await cardService.getGrammarCard(cardId);
        setGrammarCard(cardRes.data.data);
        setVocabCard(null);
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
      navigate(`/dashboard/decks/${deckId}`);
    } finally {
      setIsLoading(false);
    }
  }, [deckId, cardId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset floating UI & scroll to top when switching cards
  useEffect(() => {
    setShowFloatingUI(false);
    setActiveSection("details");
    window.scrollTo({ top: 0 });
  }, [cardId]);

  // Scroll spy — track which section is visible + floating UI visibility
  useEffect(() => {
    function handleScroll() {
      // Show sticky bar + back-to-top together when hero scrolls out
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowFloatingUI(heroBottom < 80);
      }

      // Track active section (skip during manual scroll to avoid fighting)
      if (examplesRef.current && !isManualScroll.current) {
        const examplesTop = examplesRef.current.getBoundingClientRect().top;
        setActiveSection(
          examplesTop <= window.innerHeight * 0.4 ? "examples" : "details"
        );
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  function scrollToSection(section: "details" | "examples") {
    const ref = section === "details" ? detailsRef : examplesRef;
    setActiveSection(section);

    // Temporarily disable scroll spy so it doesn't override the manual selection
    isManualScroll.current = true;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isManualScroll.current = false;
    }, 800);
  }

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (isLoading) {
    return (
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <Skeleton className="h-5 w-56 rounded-md" />
        <div className="flex flex-col items-center gap-3 pt-6">
          <Skeleton className="h-10 w-64 rounded-lg stagger-2" />
          <Skeleton className="h-5 w-40 rounded-md stagger-3" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg stagger-4" />
        <Skeleton className="h-48 w-full rounded-xl stagger-5" />
      </div>
    );
  }

  if (!deck || (!vocabCard && !grammarCard)) return null;

  const isVocab = deck.type === "Vocabulary";
  const currentCard = isVocab ? vocabCard! : grammarCard!;
  const examples: ExampleSentenceDTO[] = isVocab
    ? vocabCard?.examples ?? []
    : grammarCard?.examples ?? [];

  // Navigation between cards
  const cardIds = deck.cards.map((c) => c.id);
  const currentIndex = cardIds.indexOf(cardId!);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < cardIds.length - 1;

  function goToPrev() {
    if (!hasPrev) return;
    const prevId = cardIds[currentIndex - 1];
    navigate(`/dashboard/decks/${deckId}/cards/${prevId}`);
  }

  function goToNext() {
    if (!hasNext) return;
    const nextId = cardIds[currentIndex + 1];
    navigate(`/dashboard/decks/${deckId}/cards/${nextId}`);
  }

  function handleDeleteSuccess() {
    navigate(`/dashboard/decks/${deckId}`);
  }

  const tabClass = (section: "details" | "examples") =>
    `px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 transition-all duration-200 whitespace-nowrap ${
      activeSection === section
        ? "border-primary text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`;

  return (
    <>
      <div ref={topRef} className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in-up">
        {/* ===== Breadcrumb header ===== */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard/decks/${deckId}`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>{deck.name}</span>
            <span className="text-muted-foreground/60">·</span>
            <span>
              {currentIndex + 1}/{deck.cards.length}
            </span>
          </button>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="transition-all duration-200 hover:shadow-sm active:brightness-95"
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="text-destructive hover:text-destructive transition-all duration-200 hover:shadow-sm active:brightness-95 hover:border-destructive/30 hover:bg-destructive/5"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>

        {/* ===== Hero — Term + Meaning ===== */}
        <div
          ref={heroRef}
          className="relative flex flex-col items-center text-center py-8"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl ${
              isVocab ? "bg-primary/5" : "bg-theme-grammar/5"
            }`} />
            <div className={`absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl ${
              isVocab ? "bg-theme-grammar/3" : "bg-primary/3"
            }`} />
          </div>

          {/* Type icon */}
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${
            isVocab ? "bg-theme-vocab-light text-theme-vocab" : "bg-theme-grammar-light text-theme-grammar"
          }`}>
            {isVocab ? (
              <BookA className="h-5 w-5" />
            ) : (
              <BookType className="h-5 w-5" />
            )}
          </div>

          {/* Term */}
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
            {currentCard.term}
          </h1>

          {/* Meaning */}
          <p className="text-lg text-muted-foreground">{currentCard.meaning}</p>

          {/* Prev / Next navigation */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
            <button
              disabled={!hasPrev}
              onClick={goToPrev}
              className="pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              disabled={!hasNext}
              onClick={goToNext}
              className="pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* ===== Navigation tabs — scroll-to anchors ===== */}
        <div className="border-b flex">
          <button
            className={tabClass("details")}
            onClick={() => scrollToSection("details")}
          >
            Chi tiết
          </button>
          <button
            className={tabClass("examples")}
            onClick={() => scrollToSection("examples")}
          >
            Ví dụ ({examples.length})
          </button>
        </div>

        {/* ===== Section: Details ===== */}
        <div ref={detailsRef} className="scroll-mt-28">
          {isVocab ? (
            <VocabDetails card={vocabCard!} />
          ) : (
            <GrammarDetails card={grammarCard!} />
          )}
        </div>

        <Separator />

        {/* ===== Section: Examples ===== */}
        <div ref={examplesRef} className="scroll-mt-28">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ví dụ ({examples.length})
          </h2>
          <ExamplesSection
            examples={examples}
            onDeleteSuccess={fetchData}
            onUpdateSuccess={fetchData}
          />
          <div className="mt-4">
            <AddExampleForm
              cardId={cardId!}
              deckType={deck.type}
              onSuccess={fetchData}
            />
          </div>
        </div>

        {/* Edit / Delete Dialogs */}
        <EditCardDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          cardId={cardId ?? null}
          deckType={deck.type}
          onSuccess={fetchData}
        />
        <DeleteCardDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          cardId={cardId ?? null}
          deckType={deck.type}
          onSuccess={handleDeleteSuccess}
        />
      </div>

      {/* ===== Sticky bar — appears below DashboardHeader when scrolled ===== */}
      <div
        className={`fixed top-14 right-0 z-20 border-b shadow-sm bg-background/95 backdrop-blur-lg transition-all duration-300 ${
          showFloatingUI
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{ left: sidebarOpen ? 'var(--sidebar-width, 16rem)' : 'var(--sidebar-width-icon, 3rem)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-2">
          {/* Left: term + meaning */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-base font-bold text-primary truncate">
              {currentCard.term}
            </span>
            <span className="text-sm text-muted-foreground truncate hidden sm:inline">
              {currentCard.meaning}
            </span>
          </div>

          {/* Center: tab navigation */}
          <div className="flex items-center border-b-0 mx-4">
            <button
              className={tabClass("details")}
              onClick={() => scrollToSection("details")}
            >
              Chi tiết
            </button>
            <button
              className={tabClass("examples")}
              onClick={() => scrollToSection("examples")}
            >
              Ví dụ
            </button>
          </div>

          {/* Right: prev/next arrows */}
          <div className="flex items-center gap-1">
            <button
              disabled={!hasPrev}
              onClick={goToPrev}
              className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              disabled={!hasNext}
              onClick={goToNext}
              className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== Back to Top button ===== */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 h-11 w-11 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 cursor-pointer ${
          showFloatingUI
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        title="Lên đầu trang"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

/* ───────── Sub-components ───────── */

function VocabDetails({ card }: { card: VocabularyCardDTO }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InfoCard label="Từ khóa" value={card.term} />
      <InfoCard label="Ý nghĩa" value={card.meaning} />
    </div>
  );
}

function GrammarDetails({ card }: { card: GrammarCardDTO }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard label="Cấu trúc" value={card.structure} highlight />
        <InfoCard label="Ý nghĩa" value={card.meaning} />
      </div>
      {card.explanation && (
        <InfoCard label="Giải thích" value={card.explanation} fullWidth />
      )}
      {card.caution && (
        <InfoCard label="Lưu ý" value={card.caution} caution fullWidth />
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  highlight,
  caution,
  fullWidth,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  caution?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-sm ${
        caution ? "border-amber-200 bg-amber-50/50" : "border-border"
      } ${fullWidth ? "sm:col-span-2" : ""}`}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <p
        className={`text-sm leading-relaxed ${
          highlight
            ? "text-primary font-semibold"
            : caution
            ? "text-amber-700 font-medium"
            : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/** Build full sentence by replacing ____ with expectedAnswer, ensuring spaces around answer */
function buildFullSentence(cloze: string, answer: string): string {
  const parts = cloze.split("____");
  const before = parts[0] ?? "";
  const after = parts[1] ?? "";
  // Add space before answer if preceding char isn't whitespace/empty
  const spaceBefore = before.length > 0 && !before.endsWith(" ") ? " " : "";
  // Add space after answer if following char isn't whitespace/empty
  const spaceAfter = after.length > 0 && !after.startsWith(" ") ? " " : "";
  return `${before}${spaceBefore}${answer}${spaceAfter}${after}`;
}

function ExamplesSection({
  examples,
  onDeleteSuccess,
  onUpdateSuccess,
}: {
  examples: ExampleSentenceDTO[];
  onDeleteSuccess: () => void;
  onUpdateSuccess: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (examples.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">Chưa có câu ví dụ nào.</p>
        <p className="text-xs mt-1">Nhấn "Thêm ví dụ" để bắt đầu.</p>
      </div>
    );
  }

  async function handleDelete(exampleId: string) {
    setDeletingId(exampleId);
    try {
      await cardService.deleteExample(exampleId);
      toast.success("Đã xóa câu ví dụ");
      onDeleteSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {examples.map((ex, i) => {
        const isExpanded = expandedId === ex.id;
        const isEditing = editId === ex.id;
        const fullSentence = buildFullSentence(ex.clozeSentence, ex.expectedAnswer);
        const parts = ex.clozeSentence.split("____");

        return (
          <div
            key={ex.id}
            className={`rounded-xl border border-border bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-sm animate-fade-in-up stagger-${i + 1}`}
          >
            {/* Main row — full sentence + actions */}
            <div className="flex items-center justify-between p-4 gap-3">
              <button
                onClick={() => {
                  setExpandedId(isExpanded ? null : ex.id);
                  if (isEditing) setEditId(null);
                }}
                className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer group"
              >
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                />
                <span className="text-sm text-foreground truncate">
                  {parts[0]}{parts[0] && !parts[0].endsWith(" ") ? " " : ""}
                  <span className="font-semibold text-primary">
                    {ex.expectedAnswer}
                  </span>
                  {parts[1] && !parts[1].startsWith(" ") ? " " : ""}{parts[1] ?? ""}
                </span>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditId(ex.id);
                    setExpandedId(ex.id);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  title="Chỉnh sửa"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      title="Xóa ví dụ"
                      disabled={deletingId === ex.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xóa câu ví dụ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc muốn xóa câu ví dụ "{fullSentence}"? Hành
                        động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(ex.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Expanded detail / Edit mode */}
            {isExpanded && (
              <div className="border-t px-4 pb-4 pt-3">
                {isEditing ? (
                  <EditExampleInline
                    example={ex}
                    onCancel={() => setEditId(null)}
                    onSuccess={() => {
                      setEditId(null);
                      onUpdateSuccess();
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Câu cloze
                        </p>
                        <p className="text-sm text-foreground">
                          {ex.clozeSentence}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Đáp án
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {ex.expectedAnswer}
                        </p>
                      </div>
                    </div>
                    {ex.hint && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50/50 rounded-lg px-3 py-2">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                        <span>{ex.hint}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Inline edit form for a single example */
function EditExampleInline({
  example,
  onCancel,
  onSuccess,
}: {
  example: ExampleSentenceDTO;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateExampleFormValues>({
    resolver: zodResolver(createExampleSchema),
    defaultValues: {
      clozeSentence: example.clozeSentence,
      expectedAnswer: example.expectedAnswer,
      hint: example.hint ?? "",
    },
  });

  const watchCloze = form.watch("clozeSentence");
  const watchAnswer = form.watch("expectedAnswer");

  const previewSentence =
    watchCloze && watchAnswer && watchCloze.includes("____")
      ? watchCloze.replace("____", watchAnswer)
      : null;

  async function onSubmit(values: CreateExampleFormValues) {
    setIsSubmitting(true);
    try {
      await cardService.updateExample(example.id, {
        clozeSentence: values.clozeSentence,
        expectedAnswer: values.expectedAnswer,
        hint: values.hint || undefined,
      });
      toast.success("Đã cập nhật câu ví dụ");
      onSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="clozeSentence"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Câu cloze</FormLabel>
              <FormControl>
                <Input
                  placeholder='Dùng ____ để đánh dấu chỗ trống'
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="expectedAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Đáp án</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hint"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Gợi ý (tùy chọn)</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Live preview */}
        {previewSentence && (
          <div className="flex items-center gap-2 rounded-lg bg-background/80 border px-3 py-2 text-sm">
            <span className="text-muted-foreground">Xem trước:</span>
            <span className="text-foreground">
              {watchCloze.split("____")[0]}{watchCloze.split("____")[0] && !watchCloze.split("____")[0].endsWith(" ") ? " " : ""}
              <span className="font-semibold text-primary">{watchAnswer}</span>
              {watchCloze.split("____")[1] && !watchCloze.split("____")[1].startsWith(" ") ? " " : ""}{watchCloze.split("____")[1]}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="transition-all duration-200 hover:shadow-md active:brightness-95"
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
