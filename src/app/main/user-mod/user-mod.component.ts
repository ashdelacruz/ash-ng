import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { isEmpty, parseStatus } from 'src/app/common/utils';
import { MobileService } from 'src/app/services/mobile.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserModActions, UserModService } from 'src/app/services/user-mod.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import {
  UserSessionData
} from '../../interfaces/user-session';

@Component({
  selector: 'app-user-mod',
  templateUrl: './user-mod.component.html',
  styleUrls: ['./user-mod.component.scss'],
})
export class UserModComponent implements AfterViewInit {

  //-------User Table Vars-------
  public userTableRows: UserSessionData[] = [];
  public userTableSource = new MatTableDataSource<UserSessionData>();
  public userTableHeaders = [
    'select',
    'username',
    'email',
    'status',
    'role',
    'action',
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //Keeps track of selected rows in table
  selectedUsers = new SelectionModel<UserSessionData>(true, []);

  isLandscape: boolean;
  isAdminSession: boolean;
  isDemoMode: boolean = false;






  constructor(
    private session: UserSessionService,
    private mobileService: MobileService,
    private userSessionService: UserSessionService,
    private router: Router,
    public dialog: MatDialog,
    public userModService: UserModService,
    private spinnerService: SpinnerService
  ) {

   

  }

  ngOnInit() {

    this.isDemoMode = this.userModService.isDemoMode;
    this.isAdminSession = this.isDemoMode ? true : this.session.isModSession();

    this.mobileService.isLandscapeSub$.subscribe((isLandscape) => {
      this.isLandscape = isLandscape;
    });

      this.spinnerService.spin();
      //Populate the User table the first time
      this.userModService.getAllUsersList().subscribe(allUsersResp => {
        this.spinnerService.stop();

        this.userModService.allUsers = allUsersResp.data!.users;
        this.userTableRows = this.userModService.allUsers;
        this.userTableSource.data = this.userTableRows;
      });

      //Updates the User table after a user mod action is performed,
      //and deselect any selected users
      this.userModService.modifiedUsers$.subscribe(responseUsers => {
        this.selectedUsers.deselect(...this.selectedUsers.selected);


        if (responseUsers == null) {
          this.userModService.validUsers.forEach(deletedUser => {

            let index = this.userTableRows.findIndex(userRow => { return userRow.id === deletedUser.id });
            if (index > -1) {
              this.userTableRows.splice(index, 1);
            }
          })

          this.userModService.validUsers = [];

        } else {
          this.userTableRows = this.userTableRows.map(userRow => {
            return responseUsers.find(responseUser => { return responseUser.id === userRow.id }) ?? userRow;
          })
        }
        this.userTableSource.data = this.userTableRows;

      });

  }

  ngAfterViewInit() {
    this.userTableSource.paginator = this.paginator;
    this.userTableSource.sort = this.sort;
  }


  //-------User Table functions-------

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userTableSource.filter = filterValue.trim().toLowerCase();

    if (this.userTableSource.paginator) {
      this.userTableSource.paginator.firstPage();
    }
  }

  onRemoveChip(selected: UserSessionData) {
    this.selectedUsers.deselect(selected);
  }

  /**
   *
   * @returns TRUE when the number of selected rows matches the total number of rows; else FALSE
   */
  isMaxSelected() {
    const numSelected = this.selectedUsers.selected.length;
    return numSelected === 10;
  }

  /**
   * Toggle all rows
   *
   * If all rows are already selected, then deselect all rows;
   * else select all rows
   */
  toggleMaxRows() {
    if (this.isMaxSelected()) {
      this.selectedUsers.clear();
      this.userModService.selectedUsers = [];
    } else {
      this.userTableSource.data.slice(0, 10).forEach((user) => {
        this.selectedUsers.select(user);
      });
      this.userModService.selectedUsers = this.selectedUsers.selected;
    }
  }

  /**
   * Toggle a single row
   * @param e
   * @param user
   * @returns
   */
  toggleRow(e: MatCheckboxChange, user: UserSessionData) {
    if (e) {
      this.selectedUsers.toggle(user)
        ? this.userModService.selectedUsers = this.selectedUsers.selected
        : console.error('Error toggling row');
      return true;
    } else {
      return false;
    }
  }

  checkboxLabel(row?: UserSessionData): string {
    if (!row) {
      return `${this.isMaxSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectedUsers.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1
      }`;
  }




  //-------Button Handlers-------
  onStatusToggle(toggleElement: MatSlideToggleChange, user: UserSessionData) {
    const toggle = toggleElement.source;
    let isToggleCurrentlyChecked = toggle.checked;

    this.userModService.selectedUsers = [user];
    this.userModService.validUsers = [user];
    this.userModService.setStatusAction(!toggle.checked ? false : true, toggle);

  }

  onTableApproveBtnClick(user: UserSessionData) {
    this.userModService.selectedUsers = [user];
    this.userModService.validUsers = [user];
    this.userModService.openApproveUserRoleSelectDialog();
  }

  onTableDenyBtnClick(user: UserSessionData) {
    this.userModService.selectedUsers = [user];
    this.userModService.validUsers = [user];
    this.userModService.validateUserModAction(UserModActions.DENY);
  }

  /**
   * 
   * @param users 
   * @param isSingleUser TRUE for the Modify button in the table row,
   *                      FALSE for the Modify Selected Users on mobile view
   * @returns 
   */
  onModifyBtnClick(users: UserSessionData[], isSingleUser: boolean) {

    if (isEmpty(users)) {
      return;
    }
    this.userModService.selectedUsers = users;
    this.userModService.openModifyUserDialog(users, isSingleUser);
  }

  onResendBtnClick(user: UserSessionData) {
    this.userModService.validUsers = [user];
    this.userModService.resendAccountActivationAction();
  }

  onUnlockBtnClick(user: UserSessionData) {
    this.userModService.validUsers = [user];
    this.userModService.openUnlockUserDialog();
  }

  onResetDemoBtnClick() {
    this.spinnerService.spin();
    //Populate the User table the first time
    this.userModService.getAllUsersList().subscribe(allUsersResp => {
      this.spinnerService.stop();

      this.userTableRows = allUsersResp.data!.users;
      this.userTableSource.data = this.userTableRows;
    });
  }


  //-------Utils-------

  parseStatus(user: UserSessionData): string {
   return parseStatus(user);
  }
}
