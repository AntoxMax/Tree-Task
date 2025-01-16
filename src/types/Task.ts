export type Task = {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Task[];
  parentTaskId: string;
};
