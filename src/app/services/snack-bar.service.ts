import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  horizontalPosition: MatSnackBarHorizontalPosition | undefined = 'center';
  verticalPosition: MatSnackBarVerticalPosition | undefined = 'top';

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  showInfoSnackbar(message: string, origin?: string) {
    this.snackBar.open(origin ?? "" + "[INFO]:: " + message, "Close", {
      duration: 3000,
      panelClass: ['info-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  showWarnSnackbar(origin: string, message: string) {
    this.snackBar.open(origin + "[WARN]:: " + message, "Close", {
      duration: 3000,
      panelClass: ['warn-snackbar'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  showErrorSnackbar(message: string, origin?: string) {
    this.snackBar.open(origin ?? "" + "[ERROR]:: " + message, "Close", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['error-snackbar']
    });
  }
}
