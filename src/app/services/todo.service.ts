import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TodoItem } from '../../models/todo.type';
import { BehaviorSubject, map, Observable, toArray } from 'rxjs';
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
import { generateNotRepeatedId, generateRandomId } from '../shared/utils';

// type CRUDFunction = ((...arg: any[]) => Observable<any>) | ((...arg: any[]) => void);

interface CRUDStrategies<CRUDFunction> {
  loggedIn: CRUDFunction;
  guest: CRUDFunction;
}

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
   * Create CRUD function that checks isLoggedIn before running
   * @param strategies - contain functions who is going to run in different condition
   * @returns a function, check isLoggedIn before running
   */
  private createCRUDFunction<CRUDFunction>(strategies: CRUDStrategies<CRUDFunction>) {
    const isLoggedIn = this.checkIsLoggedIn();
    if (isLoggedIn) {
      return strategies.loggedIn;
    } else {
      return strategies.guest;
    }
  };

  /**
   * Use firebase auth to check if user logged in
   * @returns {boolean} - is user logged in
   */
  private checkIsLoggedIn(): boolean {
    // TODO
    return false;
  }

  /**
  * Return all todo items as a Observable
  * @returns {Observable<Array<TodoItem>>} an observable for all todo item
  */
  public getAllTodos = this.createCRUDFunction({
    loggedIn: () => {
      return collectionData(this.todoCollection, {
        idField: 'id',
      }) as Observable<Array<TodoItem>>
    }
    ,
    guest: this.getTodosLocalStorageObservable
  }) as () => Observable<TodoItem[]>;

  /**
 * Add a new todo
 * @param {string} title - title of new todo item
 */
  public addTodoItem = this.createCRUDFunction({
    loggedIn: (title: string) => {
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
    },
    guest: (title: string) => {
      console.log('adding new item: ' + title);
      const localTodos = this.todosLocalStorageSubject.value;
      const newId = generateNotRepeatedId(20, localTodos.map(todo => todo.id));
      console.log('the new item id: ' + newId);
      localTodos.push({
        id: newId,
        title: title,
        completed: false,
        createdAt: Date.now(),
      });
      localStorage.setItem('todos', JSON.stringify(localTodos));
      this.notifyLocalStorageChange();
    }
  });

  /**
  * Update a todo item with API
  * @param todoItem - the todo item going to update
  */
  public updateTodoItem = this.createCRUDFunction({
    loggedIn: (todoItem: TodoItem) => {
      console.log('updating todoItem: ' + todoItem.title);
      console.log(todoItem);
      try {
        // update the todo item with firebase API
        const { id, ...todoItemWithoutId } = todoItem;
        updateDoc(doc(this.firestore, 'todos', todoItem.id), todoItemWithoutId);
      } catch (error) {
        console.log(error);
      }
    },
    guest: (todoItem: TodoItem) => {
      console.log('updating todoItem: ' + todoItem.title);
      console.log(todoItem);
      try {
        const localTodos = this.todosLocalStorageSubject.value;
        const newLocalTodos = localTodos.map((todo) => {
          if (todo.id === todoItem.id) {
            return todoItem;
          }
          return todo;
        });
        localStorage.setItem('todos', JSON.stringify(newLocalTodos));
      } catch (error) {
        console.log(error);
      }
      this.notifyLocalStorageChange();
    },
  });

  /**
   * Delete target todo
   * @param todoItem - todo who is going to delete
   */
  public deleteTodoItem = this.createCRUDFunction({
    loggedIn: (todoItem: TodoItem) => {
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
    },
    guest: (todoItem: TodoItem) => {
      console.log('deleting todo: ' + todoItem.title);
      try {
        const localTodos = this.todosLocalStorageSubject.value;
        const newLocalTodos = localTodos.filter((todo) => {
          return todo.id != todoItem.id;
        });
        console.log(newLocalTodos);
        localStorage.setItem('todos',JSON.stringify(newLocalTodos));
        this.notifyLocalStorageChange();
      } catch (error) {
        console.log(error);
      }
    },
  })

  /**
   * a BehaviorSubject who reflect todos in local storage
   * @private
   * @type {BehaviorSubject<TodoItem[]>}
   */
  private todosLocalStorageSubject: BehaviorSubject<TodoItem[]> = new BehaviorSubject<TodoItem[]>(this.getAllTodosFromLocalStorage());

  /**
   * Get an Observable who emit todos from local storage
   * @returns an Observable who emit todos from local storage
   */
  private getTodosLocalStorageObservable() {
    return this.todosLocalStorageSubject.asObservable();
  };

  /**
   * get all todos from local storage, if could not get it return empty array (=> [])
   * @returns todos from local storage
   */
  private getAllTodosFromLocalStorage() {
    try {
      const todos = localStorage.getItem('todos');
      if (todos) {
        return JSON.parse(todos) as TodoItem[]
      };
    } catch (error) {
      console.log(error);
      return [];
    }
    return [];
  };

  /**
   * Should call this function when LocalStorage Change
   */
  private notifyLocalStorageChange() {
    this.todosLocalStorageSubject.next(this.getAllTodosFromLocalStorage());
  };

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

  constructor() {
    // 監聽瀏覽器的 storage 事件 (只對其他 tab 生效)
    window.addEventListener('storage', () => {
      this.todosLocalStorageSubject.next(this.getAllTodosFromLocalStorage());
    });
  }

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
   * Toggle a todo item, completed = !completed
   * @param todoItem - the todo item who is going to toggle
   */
  toggleTodoItem(todoItem: TodoItem) {
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


}
