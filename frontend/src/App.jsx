import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Widget, widgetsList } from "./widgets";
import "./App.css";

export default function App() {
  const [widgets, setWidgets] = useState(widgetsList);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center font-mono drop-shadow-lg">LiTreeLabStudio™ Dashboard</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          setWidgets((items) => {
            const oldIndex = items.findIndex((w) => w.id === active.id);
            const newIndex = items.findIndex((w) => w.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }}>
        <SortableContext items={widgets} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <Widget key={widget.id} {...widget} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <footer className="mt-12 text-center text-xs opacity-60">Drag, drop, and customize your dashboard. More widgets coming soon!</footer>
    </div>
  );
}
