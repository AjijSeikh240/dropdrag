import PlusIcon from "../icon/PlusIcon";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
// import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const defaultCols = [
  {
    id: "todo-1",
    title: "Todo List 1",
  },
  {
    id: "todo-2",
    title: "Todo List 2",
  },
  {
    id: "todo-3",
    title: "Todo List 3",
  },
];

const defaultTasks= [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with ",
  },
  {
    id: "3",
    columnId: "todo-1",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "todo-1",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "todo-2",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "todo-2",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "todo-2",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates ",
  },
  {
    id: "12",
    columnId: "todo-1",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "todo-1",
    content: "Design and implement responsive UI",
  },
];

function KanbanBoard() {

  

  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  console.log(columnsId);

  const [tasks, setTasks] = useState(defaultTasks);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  



  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const getData= async()=>{
    try {
      const {data} = await axios.get("http://localhost:8000/gettodos")
      console.log(data.data);
      setColumns(data.data)
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(()=>{
    getData();
},[])

 

  return (
    <div
      className="
        m-auto
        flex-row
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
   
       {/* m-auto flex-row gap-4 */}
        <div className="m-auto flex">
          {/* flex-row gap-4 */}
          <div className="m-auto flex "> 
       
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
  

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
             
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  // const createdata=useEffect(()=>{

  // })

 async function  createTask(columnId) {
    try {
      const newTask = {
        id: generateId(),
        columnId,
        content: ` TodoTask ${tasks.length + 1}`,
      };
         const CreateData=  await axios.post("http://localhost:8000/todustask", newTask)
         console.log(CreateData);
      setTasks([...tasks, newTask]);
      return newTask;

    } catch (error) {
      console.log(error.message);
    }
    
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
    
      return { ...task, content,  };
    });
   

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Todo List ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
