import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { taskStore } from '../store/TaskStore';
import { Task } from '../types/task';
import './style.scss';

type Props = {
  task: Task;
  level: number;
};

const TaskItem: React.FC<Props> = observer(({ task, level }) => {
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleAddSubtask = () => {
    if (subtaskTitle.trim() !== '') {
      taskStore.addSubtask(task.id, task.parentTaskId, subtaskTitle);
      setSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  return (
    <div
      style={task.parentTaskId !== '0' ? { marginLeft: '20px' } : {}}
      className="task-item"
    >
      <div className="task-item__wrapper">
        <label className="task-item__custom-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => taskStore.toggleTaskCompletion(task.id)}
          />
          <span className="task-item__checkbox-mark"></span>
          {task.title}
        </label>
        <button
          onClick={() => setIsAddingSubtask((prev) => !prev)}
          className="task-item__button task-item__add-button"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 10V14M14 12H10"
              stroke="white"
              stroke-linecap="round"
            />
            <path
              d="M9 3.5L7.59373 1.3906C7.30309 0.954634 7.15777 0.736651 6.93667 0.618325C6.71558 0.5 6.4536 0.5 5.92963 0.5H2.5C1.55719 0.5 1.08579 0.5 0.792893 0.792893C0.5 1.08579 0.5 1.55719 0.5 2.5L0.5 11.5C0.5 12.4428 0.5 12.9142 0.792893 13.2071C1.08579 13.5 1.55719 13.5 2.5 13.5H7M9 3.5H11.5C12.4428 3.5 12.9142 3.5 13.2071 3.79289C13.5 4.08579 13.5 4.55719 13.5 5.5V6.5M9 3.5H0.5"
              stroke="white"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button
          onClick={() => taskStore.deleteTask(task.id, task.parentTaskId)}
          className="task-item__button task-item__delete-button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0001 13.0008L13.5 9.50085M10.0001 9.50085L13.5 13.0008"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 3.5L7.59373 1.3906C7.30309 0.954634 7.15777 0.736651 6.93667 0.618325C6.71558 0.5 6.4536 0.5 5.92963 0.5H2.5C1.55719 0.5 1.08579 0.5 0.792893 0.792893C0.5 1.08579 0.5 1.55719 0.5 2.5L0.5 11.5C0.5 12.4428 0.5 12.9142 0.792893 13.2071C1.08579 13.5 1.55719 13.5 2.5 13.5H7M9 3.5H11.5C12.4428 3.5 12.9142 3.5 13.2071 3.79289C13.5 4.08579 13.5 4.55719 13.5 5.5V6.5M9 3.5H0.5"
              stroke="white"
              stroke-linecap="round"
            />
          </svg>
        </button>

        {isAddingSubtask && (
          <div className="task-item__form-new-task">
            <input
              type="text"
              placeholder="Название подзадачи"
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
            />
            <button onClick={handleAddSubtask}>Сохранить</button>
          </div>
        )}
      </div>

      {task.subtasks &&
        task.subtasks.length > 0 &&
        task.subtasks.map((subtask) => (
          <TaskItem key={subtask.id} task={subtask} level={level + 1} />
        ))}
    </div>
  );
});

export default TaskItem;
