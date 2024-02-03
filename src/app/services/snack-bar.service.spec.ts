import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarService } from './snack-bar.service';

describe('SnackBarService', () => {
  let service: SnackBarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spySnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SnackBarService,
        { provide: MatSnackBar, useValue: spySnackBar },
      ],
    });

    service = TestBed.inject(SnackBarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showInfoSnackbar', () => {
    it('should call MatSnackBar.open with the correct parameters for INFO message', () => {
      service.showInfoSnackbar('Test', 'Info Message');
      expect(snackBarSpy.open).toHaveBeenCalledWith('Test[INFO]:: Info Message', 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar'],
        horizontalPosition: service.horizontalPosition,
        verticalPosition: service.verticalPosition,
      });
    });
  });

  describe('showWarnSnackbar', () => {
    it('should call MatSnackBar.open with the correct parameters for WARN message', () => {
      service.showWarnSnackbar('Test', 'Warn Message');
      expect(snackBarSpy.open).toHaveBeenCalledWith('Test[WARN]:: Warn Message', 'Close', {
        duration: 3000,
        panelClass: ['warn-snackbar'],
        horizontalPosition: service.horizontalPosition,
        verticalPosition: service.verticalPosition,
      });
    });
  });

  describe('showErrorSnackbar', () => {
    it('should call MatSnackBar.open with the correct parameters for ERROR message', () => {
      service.showErrorSnackbar('Test', 'Error Message');
      expect(snackBarSpy.open).toHaveBeenCalledWith('Test[ERROR]:: Error Message', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: service.horizontalPosition,
        verticalPosition: service.verticalPosition,
      });
    });
  });

  // Add more test cases based on your requirements

});
