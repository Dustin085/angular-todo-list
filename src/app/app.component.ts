import { Component, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TodoItem } from '../models/todo.type';
import { TodoService } from './services/todo.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TodoEditorDialogComponent } from './components/dialogs/todo-editor-dialog/todo-editor-dialog.component';
import { MatSnackBarService } from './services/mat-snack-bar.service';
import { TodoDeleteDialogComponent } from './components/dialogs/todo-delete-dialog/todo-delete-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private $todo = inject(TodoService);
  /**
   * @property {string} title - app title
   */
  title = 'angular-todo-list';
  newTodoTextSig = signal('');
  dialog = inject(MatDialog);
  $snackBar = inject(MatSnackBarService);

  allTodoResult$ = this.$todo.todos$;

  /**
   * Trigger this func when todo being clicked
   * @param {TodoItem} todoItem - 被點擊到的item
   */
  handleTodoItemClick(todoItem: TodoItem) {
    console.log(todoItem);
    this.openTodoEditorDialog(todoItem);
    // send newTodoItem to $todo.updateTodoItem
    // this.$todo.updateTodoItem({ ...todoItem, completed: !todoItem.completed });
  }

  /**
   * Add new todo with newTodoTextSig()
   */
  handleAddTodoSubmit() {
    if (this.newTodoTextSig() === '') {
      this.$snackBar.openSnackBar('Can NOT add an empty todo', 'Got it', 3000);
      return;
    }
    this.$todo.addTodoItem(this.newTodoTextSig());
    this.newTodoTextSig.set('');
  }

  /**
   * Open a mat-dialog to edit todo item
   * @param todoItem - Todo item who is going to edit
   */
  openTodoEditorDialog(todoItem: TodoItem) {
    this.dialog.open(TodoEditorDialogComponent, {
      data: todoItem,
      autoFocus: false,
    });
  }

  /**
   * Open a mat-dialog to confirm DELETE todo
   * @param todoItem - Todo who is going to DELETE
   */
  openTodoDeleteDialog(todoItem: TodoItem) {
    this.dialog.open(TodoDeleteDialogComponent, {
      data: todoItem,
      autoFocus: false,
    });
  }

  /**
   * Open a mat-dialog to comfirm if user want to delete this todo
   * @param todoItem - Todo item who is going to delete
   */
  handleDeleteTodoItem(todoItem: TodoItem) {
    this.openTodoDeleteDialog(todoItem);
    // this.$todo.deleteTodoItem(todoItem);
  }

  handleToggleTodoItem(todoItem: TodoItem) {
    this.$todo.toggleTodoItem(todoItem);
  }
}
