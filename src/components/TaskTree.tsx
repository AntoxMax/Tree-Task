import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { taskStore } from '../store/TaskStore';
import TaskItem from './TaskItem';
import './style.scss';

const TaskTree: React.FC = observer(() => {
  useEffect(() => {
    taskStore.getTasks();
  }, []);

  if (taskStore.loading) {
    return <span>Загрузка задач...</span>;
  }

  return (
    <div className="task-tree">
      {taskStore.tasks && taskStore.tasks.length > 0 ? (
        taskStore.tasks.map((task) => (
          <TaskItem key={task.id} task={task} level={0} />
        ))
      ) : (
        <h5>Задач пока нет</h5>
      )}
    </div>
  );
});

export default TaskTree;
