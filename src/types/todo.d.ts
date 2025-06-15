/**
 * Represents the possible statuses for a todo item.
 * - 'todo': The task is yet to be started.
 * - 'in-progress': The task is currently being worked on.
 * - 'done': The task has been completed.
 */
type TodoStatus = 'todo' | 'in-progress' | 'done';

/**
 * Represents a single todo item.
 *
 * @property id - Unique identifier for the todo item.
 * @property description - A brief description of the task.
 * @property creationDate - The date when the todo item was created (as an ISO string).
 * @property status - The current status of the todo item.
 * @property isDone - Indicates whether the todo item is completed.
 */
interface TodoItem {
  id: string;
  description: string;
  creationDate: Date; // ISO string format
  status: TodoStatus;
  isDone: boolean;
}

export type { TodoItem };
