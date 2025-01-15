import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MatSnackBarService {
  $snackBar = inject(MatSnackBar);
  /**
   * Open a Mat-SnackBar
   * @param message - message you want to show
   * @param actionText - action button text
   * @param duration - duration until auto close (unit => ms)
   */
  openSnackBar(message: string, actionText: string, duration: number) {
    this.$snackBar.open(message, actionText, {
      duration: duration,
    });
  }
}
