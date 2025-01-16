import { makeAutoObservable, runInAction } from 'mobx';
import { TaskApi } from '../api/tasksApi';
import { Task } from '../types/task';

class TaskStore {
  constructor() {
    makeAutoObservable(this);
  }

  tasks: Task[] = [];
  loading: boolean = false;

  async getTasks() {
    this.loading = true;
    try {
      const loadedTasks = await TaskApi.getTasks();
      runInAction(() => {
        this.tasks = loadedTasks;
      });
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createTask(title: string, parentTaskId: string = '0') {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      subtasks: [],
      parentTaskId,
    };

    try {
      const createdTask = await TaskApi.createTask(newTask);

      if (parentTaskId === '0') {
        this.tasks.push(createdTask);
      } else {
        const updateSubtasks = (tasks: Task[]): Task[] =>
          tasks.map((task) => {
            if (task.id === parentTaskId) {
              task.subtasks?.push(createdTask);
            } else if (task.subtasks && task.subtasks.length > 0) {
              task.subtasks = updateSubtasks(task.subtasks);
            }
            return task;
          });

        this.tasks = updateSubtasks(this.tasks);
      }
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  }

  async deleteTask(taskId: string, parentTaskId: string = '0') {
    try {
      if (parentTaskId === '0') {
        await TaskApi.deleteTask(taskId);

        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      } else {
        const updateSubtasks = (tasks: Task[]): Task[] =>
          tasks.map((task) => {
            task.subtasks = task.subtasks?.filter(
              (subtask) => subtask.id !== taskId,
            );

            task.subtasks = updateSubtasks(task.subtasks);
            return task;
          });

        this.tasks = updateSubtasks(this.tasks);

        const parentTask = this.tasks.find((task) => task.id === parentTaskId);

        if (!parentTask) {
          console.error(`Родительская задача с id ${parentTaskId} не найдена`);
          return;
        }

        await TaskApi.updateTask(parentTaskId, {
          subtasks: parentTask.subtasks,
        });
      }
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
    }
  }

  async addSubtask(taskId: string, parentTaskId: string, subtaskTitle: string) {
    const newSubtask = {
      id: Date.now().toString(),
      title: subtaskTitle,
      completed: false,
      subtasks: [],
      parentTaskId: parentTaskId == '0' ? taskId : parentTaskId,
    };

    try {
      const updateSubtasks = (tasks: Task[]): Task[] =>
        tasks.map((task) => {
          if (task.id === taskId) {
            task.subtasks?.push(newSubtask);
          } else if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks = updateSubtasks(task.subtasks);
          }
          return task;
        });

      this.tasks = updateSubtasks(this.tasks);

      console.log(this.tasks);

      const currentId = parentTaskId == '0' ? taskId : parentTaskId;

      const parentTask = this.tasks.find((task) => task.id === currentId);
      if (parentTask) {
        await TaskApi.updateTask(currentId, parentTask);
      }
    } catch (error) {
      console.error('Ошибка добавления подзадачи:', error);
    }
  }

  toggleTaskCompletion(taskId: string, tasks: Task[] = this.tasks) {
    for (const task of tasks) {
      if (task.id === taskId) {
        task.completed = !task.completed;
        if (task.subtasks) {
          this.toggleSubtasks(task, task.completed);
        }
        break;
      } else if (task.subtasks && task.subtasks.length > 0) {
        this.toggleTaskCompletion(taskId, task.subtasks);
      }
    }
    this.updateParentCompletion(tasks);
  }

  toggleSubtasks(task: Task, completed: boolean) {
    task.subtasks?.forEach((subtask) => {
      subtask.completed = completed;
      if (subtask.subtasks) {
        this.toggleSubtasks(subtask, completed);
      }
    });
  }

  updateParentCompletion(tasks: Task[]) {
    tasks.forEach((task) => {
      if (
        task.subtasks &&
        task.subtasks.length > 0 &&
        task.subtasks.every((child) => child.completed)
      ) {
        task.completed = true;
      } else if (task.subtasks?.some((child) => !child.completed)) {
        task.completed = false;
      }
      if (task.subtasks) this.updateParentCompletion(task.subtasks);
    });
  }
}

export const taskStore = new TaskStore();
