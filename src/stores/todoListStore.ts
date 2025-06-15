import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TodoItem } from '../types/todo';
import { azureFileService } from '../services/azureFileService';

export const useTodoListStore = defineStore('todoListStore', () => {
  // Estado reactivo para la lista de tareas
  const todoList = ref<TodoItem[]>([]);

  // Cargar tareas desde Azure
  const loadTodos = async () => {
    try {
      todoList.value = await azureFileService.getTodos();
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  };

  // Guardar tareas en Azure
  const saveTodos = async () => {
    try {
      await azureFileService.saveTodos(todoList.value);
    } catch (error) {
      console.error('Error al guardar las tareas:', error);
    }
  };

  // Agregar una nueva tarea
  const addTodo = (todo: TodoItem) => {
    todoList.value.push(todo);
  };

  // Eliminar una tarea por id
  const removeTodo = (id: string) => {
    todoList.value = todoList.value.filter(todo => todo.id !== id);
  };

  // Actualizar una tarea existente
  const updateTodo = (updated: TodoItem) => {
    const idx = todoList.value.findIndex(todo => todo.id === updated.id);
    if (idx !== -1) {
      todoList.value[idx] = updated;
    }
  };

  return { todoList, loadTodos, saveTodos, addTodo, removeTodo, updateTodo };
});