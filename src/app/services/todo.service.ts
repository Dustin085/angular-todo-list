import { inject, Injectable, signal } from '@angular/core';
import { TodoItem } from '../../models/todo.type';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private firestore = inject(Firestore);

  todoCollection = collection(this.firestore, 'todos');
  todos$ = this.getAllTodos();
  isPendingSig = signal(false);

  /**
   * Return all todo items as a Observable
   * @returns {Observable<Array<TodoItem>>} - an observable for all todo item
   */
  getAllTodos(): Observable<Array<TodoItem>> {
    return collectionData(this.todoCollection, {
      idField: 'id',
    }) as Observable<Array<TodoItem>>;
    // return this.$http.get<Array<TodoItem>>(this.API_URL).pipe(shareReplay(1));
  }

  /**
   * Update a todo item with API
   * @param todoItem - the todo item going to update
   */
  updateTodoItem(todoItem: TodoItem): void {
    console.log('updating todoItem: ' + todoItem.title);
    console.log(todoItem);
    try {
      // update the todo item with firebase API
      const { id, ...todoItemWithoutId } = todoItem;
      updateDoc(doc(this.firestore, 'todos', todoItem.id), todoItemWithoutId);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Toggle a todo item, completed = !completed
   * @param todoItem - the todo item who is going to toggle
   * @returns undefined, only return because early return
   */
  togleTodoItem(todoItem: TodoItem) {
    console.log('toggling todoItem: ' + todoItem.title);
    try {
      const todoToggled = { ...todoItem, completed: !todoItem.completed };
      this.updateTodoItem(todoToggled);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return;
      }
      console.log(error);
    }
  }

  /**
   * Add a new todo item with API
   * @param {string} title - title of new todo item
   */
  addTodoItem(title: string) {
    console.log('adding new item: ' + title);
    try {
      // add new todo item with firebase API
      addDoc(this.todoCollection, {
        title: title,
        completed: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteTodoItem(todoItem: TodoItem) {
    console.log('deleting todo: ' + todoItem.title);
    try {
      deleteDoc(doc(this.firestore, 'todos', todoItem.id));
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error message: ${error.message}`);
        return;
      }
      console.log(error);
    }
  }
}
