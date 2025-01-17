import { Component, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoItem } from '../../../../models/todo.type';
import { TodoService } from '../../../services/todo.service';
import { MatSnackBarService } from '../../../services/mat-snack-bar.service';
import { BehaviorSubject, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-editor-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './todo-editor-dialog.component.html',
  styleUrl: './todo-editor-dialog.component.css',
})
export class TodoEditorDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TodoEditorDialogComponent>);
  readonly data: TodoItem = inject<TodoItem>(MAT_DIALOG_DATA);
  $todo = inject(TodoService);
  $snackBar = inject(MatSnackBarService);
  newTitleSig = signal(this.data.title);
  newCompletedSig = signal(this.data.completed);

  createTimeString = new BehaviorSubject(this.data.createdAt)
    .pipe(map(createdAt => {
      return new Date(createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    }));

  /**
   * Submit a todo item edit to database
   */
  handleSubmitTodoEdit() {
    if (this.newTitleSig() === '') {
      this.$snackBar.openSnackBar('Todo CAN NOT be empty', 'Got it', 3000);
      return;
    }
    try {
      const newTodoItem = {
        ...this.data,
        title: this.newTitleSig(),
        completed: this.newCompletedSig(),
      };
      this.$todo.updateTodoItem(newTodoItem);
    } catch (error) {
      console.log(error);
    } finally {
      this.dialogRef.close();
    }
  }
}
