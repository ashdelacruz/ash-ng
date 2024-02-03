import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, takeWhile, timer } from 'rxjs';
import { DialogInterface, DialogType } from 'src/app/interfaces/dialog';
import { StateService } from 'src/app/services/state.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {

  @Input() seconds: number | null = null;

  timeRemaining$ = timer(0, 1000).pipe(
    map(n => (this.seconds! - n) * 1000),
    takeWhile(n => n >= 0),
  );


  public isBasicDialog: boolean = false;
  public isCloseDisabledDialog: boolean = false;

  //User Mod Actions
  public isSingleUser: boolean;
  public isUserModActionDialog: boolean = false;
  public isApprovingUserDialog: boolean = false;
  public isContactDialog: boolean = false;
  public isSessionExpiredDialog: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogInterface,
    public stateService: StateService
  ) {

    this.isBasicDialog = this.dialogData.dialogType === DialogType.BASIC;
    this.isCloseDisabledDialog = this.dialogRef.disableClose!;
    this.isUserModActionDialog = this.dialogData.dialogType === DialogType.USER_MOD_ACTION || this.dialogData.dialogType === DialogType.MULTIPLE_USER_MOD_ACTION;
    this.isApprovingUserDialog = this.dialogData.dialogType === DialogType.APPROVE_USER;
    this.isContactDialog = this.dialogData.dialogType === DialogType.CONTACT;
    this.isSessionExpiredDialog = this.dialogData.dialogType === DialogType.LOGIN;

    this.seconds = this.dialogData.dialogTimeoutSeconds ?? null;


    this.isSingleUser = this.dialogData.dialogType === DialogType.USER_MOD_ACTION ? true : false;

  }
  ngOnInit(): void { }

  onPrimaryButtonClick() {
    this.stateService.isAsyncOperationRunning$.next(true);
    setTimeout(() => {
      this.dialogData.callbackMethod();
      this.stateService.isAsyncOperationRunning$.next(false);
    }, 500);
  }

  onSecondaryButtonClick() {
    this.stateService.isAsyncOperationRunning$.next(true);
    setTimeout(() => {
      this.dialogData.callbackMethod();
      this.stateService.isAsyncOperationRunning$.next(false);
    }, 500);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}