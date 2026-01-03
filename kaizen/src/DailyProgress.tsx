import { useEffect, useRef, useState } from "react";

interface ProgressItem {
  id: string;
  text: string;
}
const initEmptyProgressItem = () => ({ id: `${Date.now()}`, text: "" });

export const DailyProgress: React.FC = () => {
  const [items, setItems] = useState<ProgressItem[]>([initEmptyProgressItem()]);
  const itemRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  useEffect(() => {
    if (items.length > 0) {
      const lastInputId = items[items.length - 1].id;
      const lastInput = itemRefs.current.get(lastInputId);

      if (lastInput) {
        lastInput.focus();
      }
    }
  }, [items]);

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
    console.log("items after setting", items);
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const currentItem = items[index];
      console.log("currentItem", currentItem);
      if (currentItem.text.trim() !== "" || index === items.length - 1) {
        const newItem: ProgressItem = initEmptyProgressItem();
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
        setItems([initEmptyProgressItem()]);
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
          ></input>
        ))}
      </div>
    </section>
  );
};
