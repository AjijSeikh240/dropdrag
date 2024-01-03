import { useState, useEffect } from "react";
// import TrashIcon from "../icon/TrashIcon";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({
  task,
  deleteTask,
  updateTask,
  updateId,
  updateCon,
  dragActiveId,
}) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const filteredDragId = [task].filter((ele) => ele.id === dragActiveId);
  
console.log("mouse",mouseIsOver)

  const Id = filteredDragId[0]?.id;
  const columnId = filteredDragId[0]?.columnId;

  const DragEleUpdate = async (Id, columnId) => {
    try {
      if (Id && columnId) {
        const { updatedData } = await axios.patch(
          "http://localhost:8000/autocontentupdate",
          { id: Id, columnId }
        );
        console.log({ updatedData });
      
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    DragEleUpdate(Id, columnId);
  }, [Id, columnId]);

  const handleUpdate = async (updateId, updateCon) => {
    try {
     
      if (updateId && updateCon) {
       
        await axios.patch("http://localhost:8000/contentupdate", {
          id: updateId,
          content: updateCon,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (Id) => {
    try {
      if (Id) {
        try {
          const { data } = await axios.delete(
            `http://localhost:8000/contentdelete/${Id}`
          );
          deleteTask(data?.data);
        } catch {
          console.log("delete api call problem");
        }
      }
    } catch {
      return console.log("delete v");
    }
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  


  const toggleEditMode = () => {
    if (updateId === null) {
      setMouseIsOver(false);
      setTimeout(() => {
        setEditMode((prev) => !prev);
      }, 1000);
     
    } else {
      setMouseIsOver(false);
      setTimeout(() => {
        setEditMode((prev) => !prev);
      }, 1000);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[70px] min-h-[70px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="bg-mainBackgroundColor p-2.5 h-[70px] min-h-[50px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
        >
          <textarea
            className="
        h-[80%]
        w-400px resize-none border-none rounded bg-transparent focus:outline-none
        "
            value={task.content}
            autoFocus
            placeholder="Task content here"
       
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
              }
            }}
            onChange={(e) => updateTask(task.id, e.target.value)}
          />
   

          {task.id === updateId ? (
            <span>
              <button
                className="bg-gray-300 rounded-md mt-1 mb-1 ml-4 "
                onClick={() => handleUpdate(updateId, updateCon)}
              >
                {task.id === updateId ? "Update Button" : null}
              </button>
            </span>
          ) : (
            <span>
              <button
                className="bg-gray-300 rounded-md mt-1 mb-1 ml-4 "
                onClick={() => handleDelete(task.id)}
              >
                {task?.id && !mouseIsOver ? "Delete Button" : null}
              </button>
            </span>
          )}
        </div>
      </>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor p-2.5 h-[70px] min-h-[50px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[80%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {/* {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      )} */}
    </div>
  );
}

export default TaskCard;
