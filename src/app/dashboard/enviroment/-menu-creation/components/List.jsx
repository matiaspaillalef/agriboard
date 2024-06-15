"use client";

import { Fragment } from "react";
import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ListChildren from "./ListChildren";

const List = ({ list, dragging }) => {
  const [subItemsVisible, setSubItemsVisible] = useState(false);
  const [items, setItems] = useState([list]); // Estado para almacenar la lista de elementos


  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  //console.log("List", list);
  //console.log("List", items);

  const toggleSubItemsVisibility = () => {
    if (dragging == true) {
      setSubItemsVisible(false);
    } else {
      setSubItemsVisible(!subItemsVisible);
    }
  };

  const removeItem = () => {
  
    // Eliminar elemento de la lista en el frontend
    const updatedItems = items.filter((item) => item.id !== list.id);
    setItems(updatedItems);

    // Enviar solicitud a la API para actualizar los datos
    // Aquí deberías implementar la lógica para enviar la solicitud a la API
    // utilizando fetch u otra librería para manejar las solicitudes HTTP
    console.log("Eliminar elemento con ID:", list.id);
  };

  return (
    <li
      style={style}
      ref={setNodeRef}
      aria-describedby={list.id}
      className="mb-3"
    >
      <div className="flex gap-3 justify-between">
        <div className="info_menu flex gap-3 items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-900 rounded-md">
            {list.icon && (
              <list.icon className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </div>
          <div className="text-sm font-semibold text-gray-800 dark:text-white">
            {list.name}
          </div>
          <div className="flex items-center justify-center text-sm">
            {list.url}
          </div>
        </div>
        <div className="flex items-center justify-center text-sm">
          {list.children && (
            <button
              type="button"
              onClick={toggleSubItemsVisibility}
              className={
                subItemsVisible === list.id
                  ? "rotate-180 transition-transform duration-300"
                  : "transition-transform duration-300"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            id="edit"
            onClick={() => console.log("click: Edit")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
          {!list.children && (
            <button type="button" id="remove"  onClick={removeItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-describedby={list.id}

            onDragEnd={() => {console.log("drag end")}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </button>
        </div>
      </div>

      {subItemsVisible && list.children && (
        <ul className={`flex gap-5 py-[20px] ps-[40px] flex-col my-5 ml-5 bg-lightPrimary rounded-md ${dragging == true ? 'hidden' : ''} `}>
          {list.children.map((item) => (
            <ListChildren key={item.id} children={item} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default List;
