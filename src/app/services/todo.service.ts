import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TodoItem } from '../../models/todo.type';
import { map, Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

/**
 * This service can 'CRUD' todos, base on firebase.
 *
 * @exports
 * @class TodoService
 */
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  /**
   * firestore, will need this when using firebase
   * @private
   * @type {Firestore}
   */
  private firestore: Firestore = inject(Firestore);

  /**
   * Firebae Database collection of todos
   * @private
   * @type {CollectionReference}
   */
  private todoCollection: CollectionReference = collection(this.firestore, 'todos');

  /**
   * A signal<boolean> reflect isPending to firebase
   * @public
   * @type {WritableSignal<boolean>}
   */
  public isPendingSig: WritableSignal<boolean> = signal(false);

  /**
   * Observable, emit sorted todos(sorted by new to old)
   * @public
   * @type {Observable<TodoItem[]>}
   */
  public todos$: Observable<TodoItem[]> = this.getAllTodos()
    .pipe(map(todos => {
      return todos.sort((a, b) => {
        // descend, cause bigger number means the time is closer
        return b.createdAt - a.createdAt;
      });
    }));

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
   * Add a new todo
   * @param {string} title - title of new todo item
   */
  addTodoItem(title: string) {
    console.log('adding new item: ' + title);
    try {
      // add new todo item with firebase API
      addDoc(this.todoCollection, {
        title: title,
        completed: false,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Delete target todo
   * @param todoItem - todo who is going to delete
   */
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
