import { defineStore } from 'pinia';

export const useTodoListStore = defineStore(
  'todoListStore',
  () => {
    const todoList = {
      id: "uuid",
      description: "Task 1",
      creationDate: "2025-06-12",
      isDone: false,
      status: "todo"
    }

    return { todoList }
  }
);