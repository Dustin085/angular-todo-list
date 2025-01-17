import { Component, inject } from '@angular/core';
import { TodoEditorDialogComponent } from '../todo-editor-dialog/todo-editor-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TodoService } from '../../../services/todo.service';
import { MatSnackBarService } from '../../../services/mat-snack-bar.service';
import { MatListModule } from '@angular/material/list';
import { TodoItem } from '../../../../models/todo.type';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './todo-delete-dialog.component.html',
  styleUrl: './todo-delete-dialog.component.css',
})
export class TodoDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TodoEditorDialogComponent>);
  readonly data: TodoItem = inject<TodoItem>(MAT_DIALOG_DATA);
  $todo = inject(TodoService);
  $snackBar = inject(MatSnackBarService);

  /**
   * Try delete todo via todo.service, if catch error, would try to show error with snackBar
   * @param todoItem - todo who is going to DELETE
   */
  handleDeleteTodo(todoItem: TodoItem) {
    try {
      this.$todo.deleteTodoItem(todoItem);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        this.$snackBar.openSnackBar(error.message, 'Get It', 3000);
      }
    } finally {
      this.dialogRef.close();
    }
  }
}
