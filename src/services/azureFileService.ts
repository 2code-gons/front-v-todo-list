import axios from 'axios';
import type { TodoItem } from '../types/todo';


// Configuración de la URL y SAS Token (reemplaza con tus valores reales)
const AZURE_FILE_URL = 'https://a080123738.file.core.windows.net/todolist/todo.json';
const SAS_TOKEN = '?sv=2024-11-04&ss=f&srt=sco&sp=rwdlc&se=2030-06-14T09:48:17Z&st=2025-06-15T01:48:17Z&spr=https&sig=GUJ0QBogBGnbQBIBVfONBlbww0Xit1IhBl4Ju5hWBd0%3D';


// Headers requeridos por Azure File Storage
const AZURE_HEADERS = {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'x-ms-version': '2023-11-03',
  'Content-Type': 'application/json'
};


/**
 * Retrieves the list of todo items from the Azure file service.
 *
 * @returns A promise that resolves to an array of `TodoItem` objects.
 * @throws Will throw an error if the request to fetch the todo items fails.
 */
const getTodos = async (): Promise<TodoItem[]> => {
  try {
    const response = await axios.get(`${AZURE_FILE_URL}${SAS_TOKEN}`, {
      headers: AZURE_HEADERS
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw new Error('No se pudieron cargar las tareas');
  }
};

/**
 * Saves an array of TodoItem objects to Azure Blob Storage.
 *
 * This function serializes the provided todos array to JSON and uploads it
 * as a BlockBlob to the specified Azure Blob Storage container using an HTTP PUT request.
 * If the operation fails, it logs the error and throws a new error.
 *
 * @param todos - The array of TodoItem objects to be saved.
 * @returns A Promise that resolves when the save operation is complete.
 * @throws Will throw an error if the save operation fails.
 */
const saveTodos = async (todos: TodoItem[]): Promise<void> => {
  try {
    await axios.put(
      `${AZURE_FILE_URL}${SAS_TOKEN}`,
      JSON.stringify(todos),
      {
        headers: {
          ...AZURE_HEADERS,
          'x-ms-blob-type': 'BlockBlob'
        }
      }
    );
  } catch (error) {
    console.error('Error al guardar las tareas:', error);
    throw new Error('No se pudieron guardar las tareas');
  }
};

// Export the service functions for use in other parts of the application
// This allows you to import and use these functions in your components or stores
export const azureFileService = {
  getTodos,
  saveTodos
};