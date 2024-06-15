"use client";

import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import List from "./List";
import { primaryMenu } from "@/app/data/dataMenu";

const ListDrop = () => {
  const [list, setList] = useState(primaryMenu);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (event) => {
    setDragging(true);
  };

  const hanhandlerDragEnd = (event) => {
    const { active, over } = event;
    setDragging(null);

    setList((list) => {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over.id);

      return arrayMove(list, oldIndex, newIndex);

      //Acá chacemos el fetch al backend, para enviar nuevo array
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={hanhandlerDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={list} strategy={verticalListSortingStrategy}>
        <ul>
        {list.map((item) => (
          <List key={item.id} list={item} dragging={dragging}/>
        ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default ListDrop;
