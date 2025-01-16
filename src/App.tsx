import { useState } from 'react';
import './App.css';
import TaskTree from './components/TaskTree';
import { taskStore } from './store/TaskStore';

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleCreateTask = () => {
    if (newTaskTitle.trim() !== '') {
      taskStore.createTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };
  return (
    <>
      <h1>Задачи</h1>
      <div className="create-task">
        <input
          type="text"
          placeholder="Название задачи"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={handleCreateTask}>Создать задачу</button>
      </div>
      <TaskTree />
    </>
  );
}

export default App;
