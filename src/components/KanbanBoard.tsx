import { useState } from "react";

import { Task, TaskActivity } from "../constants/types";
import ColumnContainer from "./ColumnContainer";
import {
  columnData,
  taskActivities as taskActivityData,
} from "../constants/data";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import { useMoveTask, useUpdateTask } from "src/api/taskApi";
import { showNotification } from "src/utils/notificationUtil";

type BoardProps = {
  name?: string;
  tasks: Task[];
  isPublic: boolean;
};

const KanbanBoard = (props: BoardProps) => {
  const { name, isPublic, tasks: taskData } = props;
  const columns = columnData;
  const [taskActivities, setTaskActivities] =
    useState<TaskActivity[]>(taskActivityData);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>();
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: moveTask } = useMoveTask();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );

  // console.log("in board", isPublic, taskData);

  // Task
  const openCreateTaskModal = () => {
    setOpenAddTask(true);
  };

  //  TODO: CAN DELETE TASK CANCEL COLUMN
  // const deleteTask = (taskId: Id) => {
  //   setTasks(tasks.filter((task) => task.id !== taskId));
  //   notifyDeleteTask(true);
  // };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    setOpenEditTask(true);
  };

  // const handleAddingTaskActivity = (activityContent: string) => {
  //   const newTaskActivity: TaskActivity = {
  //     id: generateUniqueId("activity"),
  //     taskId: selectedTask?.id || "",
  //     user: "Thien Nguyen", // current user
  //     date: new Date(),
  //     content: activityContent,
  //   };

  //   setTaskActivities([newTaskActivity, ...taskActivities]);
  // };

  // ---------------------------------------------DND LOGIC
  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Column") {
      return;
    }

    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    // console.log("DRAG TASK: Active:", active, "Over task", over);
    console.log(
      "DRAG_OVER: Active task ID:",
      active.data?.current?.sortable.index,
      "Over ID:",
      over.data?.current?.sortable.index
    );

    if (!isActiveTask) return;

    // Drop a task over another task
    if (isActiveTask && isOverTask) {
        moveTask(
          {
            taskId: active.id.toString(),
            startPosition: active.data?.current?.sortable.index,
            overPosition: over.data?.current?.sortable.index,
            status: over.data?.current?.sortable.containerId,
          },
          {
            onSuccess: () => {
              showNotification("success", "Move OK");
            },
            onError: () => {
              showNotification("warning", "Move failed");
            },
          }
        );
        // console.log("MOVING", activeId)
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    // // console.log("DRAG TASK: Active:", active, "Over task", over);
    // // console.log(
    // //   "DRAG_OVER: Active task ID:",
    // //   active.data?.current?.sortable.index,
    // //   "Over ID:",
    // //   over.data?.current?.sortable.index
    // // );

    // if (!isActiveTask) return;

    // Drop a task over another task
    if (isActiveTask && isOverTask) {
      // moveTask({
      //   taskId: active.id.toString(),
      //   startPosition: active.data?.current?.sortable.index,
      //   overPosition: over.data?.current?.sortable.index,
      //   status: over.data?.current?.sortable.containerId,
      // });
    }

    // Drop a task over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      // console.log("move to column");
      const task = taskData.find((task) => task.id === activeId);
      const column = columns.find((col) => col.id === overId);

      // console.log("DRAG_END: Active task ID:", activeId, "Over ID:", overId);

      if (task && column) {
        const updatedTask = {
          ...task,
          status: column.status, // Update task status to match the column status
        };

        // Call the API to update the task
        updateTask({
          taskId: activeId.toString(),
          updatedTask: {
            name: updatedTask.name,
            status: updatedTask.status,
            dateTimeFinish: updatedTask.dateTimeFinish.toString(),
            isPublic: updatedTask.isPublic,
            description: updatedTask.description,
            assignedUserId: "",
          },
        });

        console.log("Task moved to column:", column.title);
      }
    }
  };
  // ---------------------------------------------------------------------------

  return (
    <div>
      <div className="px-4">
        <p className="text-xl font-semibold">{name}</p>
      </div>
      <div className="flex gap-2 p-4">
        {/* Enable DND in private board */}
        {!isPublic ? (
          // Enable drag-and-drop when isPublic is true
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="flex gap-4">
              {columns.map((col) => (
                <div key={col.id} id={col.id.toString()}>
                  <ColumnContainer
                    key={col.id}
                    isPublic={isPublic}
                    column={col}
                    tasks={taskData.filter(
                      (task: Task) => task.status === col.status
                    )}
                    openAddTask={openCreateTaskModal}
                    selectTask={selectTask}
                    taskActivities={taskActivities}
                  />
                </div>
              ))}
            </div>
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  selectTask={selectTask}
                  task={activeTask}
                  taskActivities={taskActivities}
                />
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          // Render without drag-and-drop when isPublic is false
          <div className="flex gap-4">
            {columns.map((col) => (
              <div key={col.id} id={col.id.toString()}>
                <ColumnContainer
                  key={col.id}
                  isPublic={isPublic}
                  column={col}
                  tasks={taskData.filter(
                    (task: Task) => task.status === col.status
                  )}
                  openAddTask={openCreateTaskModal}
                  selectTask={selectTask}
                  taskActivities={taskActivities}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for editing task */}
      {selectedTask && (
        <EditTaskModal
          open={openEditTask}
          task={selectedTask}
          handleClose={() => setOpenEditTask(false)}
        />
      )}

      {/* Modal add task */}
      <AddTaskModal
        open={openAddTask}
        handleClose={() => setOpenAddTask(false)}
      />
    </div>
  );
};

export default KanbanBoard;
