import { Tag, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export function TagFilter({ availableTags, selectedTags, onTagToggle, onClearAll }: TagFilterProps) {
  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2" role="region" aria-labelledby="tag-filter-label">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span id="tag-filter-label" className="text-sm font-medium text-foreground">Filter by tags</span>
        </div>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagToggle(tag)}
              aria-pressed={isSelected}
              aria-label={`Filter by ${tag} tag`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {tag}
              {isSelected && <X className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
