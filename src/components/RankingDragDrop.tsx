import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RankingOption {
  id: string;
  name: string;
  emoji: string;
}

interface RankingDragDropProps {
  options: Array<{ name: string; emoji: string }>;
  onComplete: (ranking: string[]) => void;
  onCancel: () => void;
  xpReward: number;
}

function SortableItem({ option }: { option: RankingOption }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-move ${
        isDragging ? "ring-2 ring-primary z-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="text-2xl">{option.emoji}</span>
        <span className="font-medium text-lg flex-1">{option.name}</span>
      </div>
    </Card>
  );
}

export function RankingDragDrop({ options, onComplete, onCancel, xpReward }: RankingDragDropProps) {
  const [items, setItems] = useState<RankingOption[]>(
    options.map((opt, idx) => ({
      id: `${opt.name}-${idx}`,
      name: opt.name,
      emoji: opt.emoji,
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    const ranking = items.map(item => item.name);
    onComplete(ranking);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Rank by dragging</h3>
        <p className="text-sm text-muted-foreground">
          Drag items to reorder them from most preferred (top) to least preferred (bottom)
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <SortableItem option={option} />
                </div>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleSubmit}>
          Submit Ranking & Earn {xpReward} XP
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
