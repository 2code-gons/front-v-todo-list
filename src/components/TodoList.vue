<script setup lang="ts">
import TodoListItem from './TodoListItem.vue';
import { useTodoListStore } from '@/stores/todoListStore';
import { onMounted, watch } from 'vue';

const todoListStore = useTodoListStore();

onMounted(async () => {
	await todoListStore.loadTodos();
	console.table(todoListStore.todoList);
});


</script>

<template>
	Todo List Component Works.
	<br />

	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Descripción</th>
				<th>Fecha de Creación</th>
				<th>Estado</th>
				<th>¿Completado?</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="todo in todoListStore.todoList" :key="todo.id">
				<td>{{ todo.id.split('-')[0] }}</td>
				<td>{{ todo.description }}</td>
				<td>{{ todo.creationDate }}</td>
				<td>{{ todo.status }}</td>
				<td>
					<input type="checkbox" :checked="todo.isDone" />
				</td>
			</tr>
		</tbody>
	</table>
	

	<TodoListItem></TodoListItem>
</template>