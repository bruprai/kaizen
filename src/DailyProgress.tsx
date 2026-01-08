import { useCallback, useEffect, useRef, useState } from "react";
import {
  createNewProgressItem,
  type DailyProgressModel,
  type ProgressItemModel,
} from "./types";

interface DailyProgressProps {
  progressDay: DailyProgressModel;
  onUpdateProgress: (updatedDay: DailyProgressModel) => void;
  isEditable: boolean;
}
export const DailyProgress: React.FC<DailyProgressProps> = ({
  progressDay,
  onUpdateProgress,
  isEditable,
}) => {
  const [items, setItems] = useState<ProgressItemModel[]>(progressDay.items);
  const itemRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const saveDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    setItems(progressDay.items);
  }, [progressDay.items]);

  useEffect(() => {
    if (items.length > 0) {
      const lastInputId = items[items.length - 1].id;
      const lastInput = itemRefs.current.get(lastInputId);

      if (lastInput) {
        lastInput.focus();
      }
    }
  }, [items]);

  const triggerSave = useCallback(() => {
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }
    saveDebounceRef.current = setTimeout(() => {
      onUpdateProgress({ ...progressDay, items: items });
    }, 500);
  }, [items, onUpdateProgress, progressDay]);

  const focusItem = (targetIndex: number): void => {
    if (targetIndex >= 0 && targetIndex < items.length) {
      const targetItemId = items[targetIndex].id;
      const targetInput = itemRefs.current.get(targetItemId);
      if (targetInput) {
        targetInput.focus();
      }
    }
  };
  const handleChange = (id: string, value: string) => {
    setItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === id ? { ...prevItem, text: value } : prevItem
      )
    );
  };

  useEffect(() => {
    if (isEditable) {
      triggerSave();
    }
    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
      }
    };
  }, [items, isEditable, triggerSave]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!isEditable) return;
    if (event.key === "Enter") {
      event.preventDefault();
      const currentItem = items[index];
      console.log("currentItem", currentItem);
      if (currentItem.text.trim() !== "" || index === items.length - 1) {
        const newItem: ProgressItemModel = createNewProgressItem();
        setItems((prevItems) => [...prevItems, newItem]);
      }
    } else if (event.key === "ArrowUp") {
      console.log("prev item");
      focusItem(index - 1);
    } else if (event.key === "ArrowDown") {
      console.log("next item");
      focusItem(index + 1);
    } else if (
      event.key === "Backspace" &&
      items[index].text === "" &&
      items.length > 1
    ) {
      event.preventDefault();
      setItems((prevItems) =>
        prevItems.filter((_, i) => {
          console.log("i", i);
          return i !== index;
        })
      );
      if (index > 0) {
        focusItem(index - 1);
      } else if (items.length === 1 && index === 0) {
        setItems([createNewProgressItem()]);
      }
    }
  };
  return (
    <section className="daily-progress">
      <h1>Daily Progress</h1>
      <p>Track your daily activities and progress.</p>
      <div className="progress-list">
        {items.map((item, index) => (
          <input
            key={item.id}
            type="text"
            ref={(element) => {
              itemRefs.current.set(item.id, element);
            }}
            value={item.text}
            onChange={(e) => handleChange(item.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="Write you content"
            className="progress-input"
            readOnly={!isEditable}
          ></input>
        ))}
        {!isEditable && items.every((item) => item.text.trim() === "") && (
          <p className="no-entry-message">No enteries for this day</p>
        )}
      </div>
    </section>
  );
};
