import axios from 'axios';
import { Task } from '../types/task';

const API_BASE_URL = 'https://678940b02c874e66b7d82abe.mockapi.io/tasks';

export const TaskApi = {
  getTaskById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  getTasks: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },
  createTask: async (task: {
    title: string;
    completed: boolean;
    subtasks: Task[];
  }) => {
    const response = await axios.post(`${API_BASE_URL}`, task);
    return response.data;
  },

  deleteTask: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  updateTask: async (id: string, updatedTask: Task) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedTask);
    return response.data;
  },
};
