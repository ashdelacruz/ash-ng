import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import { StateService } from 'src/app/services/state.service';
import { BehaviorSubject } from 'rxjs';
import { DialogType, DialogInterface } from 'src/app/interfaces/dialog';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;

  beforeEach(() => {
    const spyMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const spyStateService = jasmine.createSpyObj('StateService', ['isAsyncOperationRunning$']);

    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: spyMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: StateService, useValue: spyStateService },
      ],
    });

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    matDialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<DialogComponent>>;
    stateServiceSpy = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPrimaryButtonClick', () => {
    it('should call dialogData.callbackMethod and set isAsyncOperationRunning$ to false after a delay', () => {
      const callbackSpy = jasmine.createSpy('callbackMethod');
      component.dialogData = { dialogTitle: "test", dialogType: DialogType.BASIC, cancelButtonLabel: 'cancel',callbackMethod: callbackSpy } as DialogInterface;

      component.onPrimaryButtonClick();

      expect(stateServiceSpy.isAsyncOperationRunning$.next).toHaveBeenCalledWith(true);
      expect(callbackSpy).not.toHaveBeenCalled();

      // Fast-forward time to simulate the delay
      jasmine.clock().tick(501);

      expect(callbackSpy).toHaveBeenCalled();
      expect(stateServiceSpy.isAsyncOperationRunning$.next).toHaveBeenCalledWith(false);
    });
  });

  // Add more test cases for other methods and properties

  describe('onSecondaryButtonClick', () => {
    it('should call dialogData.callbackMethod and set isAsyncOperationRunning$ to false after a delay', () => {
      const callbackSpy = jasmine.createSpy('callbackMethod');
      component.dialogData = { dialogTitle: "test", dialogType: DialogType.BASIC, cancelButtonLabel: 'cancel', callbackMethod: callbackSpy } as DialogInterface;

      component.onSecondaryButtonClick();

      expect(stateServiceSpy.isAsyncOperationRunning$.next).toHaveBeenCalledWith(true);
      expect(callbackSpy).not.toHaveBeenCalled();

      // Fast-forward time to simulate the delay
      jasmine.clock().tick(501);

      expect(callbackSpy).toHaveBeenCalled();
      expect(stateServiceSpy.isAsyncOperationRunning$.next).toHaveBeenCalledWith(false);
    });
  });

  // Add more test cases for other methods and properties

  describe('closeDialog', () => {
    it('should call dialogRef.close', () => {
      component.closeDialog();
      expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
  });
});
