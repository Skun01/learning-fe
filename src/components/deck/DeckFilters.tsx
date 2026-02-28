import { MagnifyingGlass as Search } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeckFiltersProps {
  keyword: string;
  type: string;
  onKeywordChange: (val: string) => void;
  onTypeChange: (val: string) => void;
}

const FILTER_TABS = [
  { label: "Tất cả", value: "" },
  { label: "Từ vựng", value: "Vocabulary" },
  { label: "Ngữ pháp", value: "Grammar" },
];

export function DeckFilters({
  keyword,
  type,
  onKeywordChange,
  onTypeChange,
}: DeckFiltersProps) {
  return (
    <div className="space-y-3 animate-fade-in-up">
      {/* Search */}
      <div className="relative max-w-sm group/search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within/search:text-primary" />
        <Input
          placeholder="Tìm kiếm bộ thẻ..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-10 transition-all duration-200 focus:shadow-sm focus:shadow-primary/10"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={type === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(tab.value)}
            className="transition-all duration-200 hover:shadow-sm active:brightness-95"
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
