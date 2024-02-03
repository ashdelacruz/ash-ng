import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { EnvironmentService } from 'src/environments/environment.service';
import { isEmpty } from '../common/utils';
import { DialogInterface, DialogText, DialogType } from '../interfaces/dialog';
import { Authority, AuthorityTypes, UserSessionData, demoModeAdminRole, demoModeGuestRole, demoModeModRole, demoModeUserRole, getRoleString } from '../interfaces/user-session';
import { DialogComponent } from '../main/shared-components/dialog/dialog.component';
import { RestService } from './rest.service';
import { SpinnerService } from './spinner.service';
import { UserSessionService } from './user-session.service';


const USER_MOD_PATH: string = '/api/mod/user';
const USER_MOD_DEMO_PATH: string = '/api/demo/user';

export interface UserModRequestBody {
  ids: string[];
  newRole?: AuthorityTypes;
  newStatus?: boolean;
}

export interface ContactUserRequestBody {
  names: string[];
  emails: string[];
  message: string;
}

export interface UserModResponseBody {
  status: number;
  message: string | null;
  data: { users: UserSessionData[] };
}

export enum UserModActions {
  APPROVE = 'Approve',
  DENY = 'Deny',

  RESEND = 'Resend Account Activation Link',

  ACTIVATE = 'Activate',
  DEACTIVATE = 'Deactivate',

  SET_GUEST = 'Set Guest',
  SET_USER = 'Set User',
  SET_MOD = 'Set Mod',
  SET_ADMIN = 'Set Admin',

  CONTACT = 'Contact',

  CHANGE_UNAME = 'Username',
  CHANGE_EMAIL = 'Email',

  DELETE = 'Delete',
}

@Injectable({
  providedIn: 'root',
})
export class UserModService {

  //-------User Lists-------
  private _modifiedUsersSub: Subject<UserSessionData[] | null> =
    new BehaviorSubject<
      UserSessionData[] | null
    >([]);
  public allUsers: UserSessionData[] = [];
  public selectedUsers: UserSessionData[] = [];

  public invalidUsers: UserSessionData[] = []; //Users that do NOT apply to this action
  public validUsers: UserSessionData[] = []; //Users that apply to this action

  private invalidText: string | null = null;
  private validText: string | null = null;
  private additionalText: DialogText | null = null;
  private USER_MOD_URL = "";
  private USER_MOD_DEMO_URL = "";

  private currentAction: UserModActions;
  public isDemoMode: boolean = false; //Demo mode allows the User Mod component to be used with fake users

  constructor(
    public dialog: MatDialog,
    private restService: RestService,
    private session: UserSessionService,
    private spinnerService: SpinnerService,
    private environmentService: EnvironmentService

  ) {
    this.isDemoMode = !this.session.isModSession() && !this.session.isAdminSession();
    this.USER_MOD_URL = this.environmentService.backendUrl + USER_MOD_PATH;
    this.USER_MOD_DEMO_URL = this.environmentService.backendUrl + USER_MOD_DEMO_PATH;

  }

  //-------API Calls-------

  getAllUsersList(): Observable<UserModResponseBody> {

   if (this.isDemoMode) {
      return this.restService.get(this.USER_MOD_DEMO_URL + '/list');

    } else {
      return this.restService.get(this.USER_MOD_URL + '/list');

    }
  }

  //TODO: Implement contactUser functionaliy
  // contactUsers(userIDs: UserSessionData[], message: string): Observable<UserModResponseBody> {

  //   // return this.restService.get((this.isDemoMode ? USER_MOD_DEMO_URL : USER_MOD_URL) + '/list');
  //   if (this.isDemoMode) {
  //     return of({
  //       status: HttpStatusCode.Ok,
  //       message: "request successful",
  //       data: { users: demoModeUserList },
  //     });
  //   } else {

  //     let requestBody: ContactUserRequestBody = {
  //       names: userIDs.flatMap(user => {
  //         return user.username;
  //       }),
  //       emails: userIDs.flatMap(user => {
  //         return user.email;
  //       }),
  //       message: message
  //     };

  //     return this.restService
  //     .post(this.USER_MOD_URL + '/contact', requestBody, {
  //       'Content-Type': 'application/json',
  //     });

  //   }
  // }

  resendAccountActivationLink(userIDs: UserSessionData[]): Observable<UserModResponseBody> {
    let requestBody: UserModRequestBody = {
      ids: userIDs.flatMap(user => {
        return user.id;
      })
    };
    console.debug("user-mod-service.resendAccountActivationLink():: requestBody= ", requestBody);

    if (this.isDemoMode) {

      return this.restService
        .post(this.USER_MOD_DEMO_URL + '/resend', requestBody, {
          'Content-Type': 'application/json',
        });

    } else {
      return this.restService
        .post(this.USER_MOD_URL + '/resend', requestBody, {
          'Content-Type': 'application/json',
        });
    }


  }

  unlockUser(userIDs: UserSessionData[]): Observable<UserModResponseBody> {

    let requestBody: UserModRequestBody = {
      ids: userIDs.flatMap(user => {
        return user.id;
      })
    };
    console.debug("user-mod-service.unlockUser():: requestBody= ", requestBody);

    if (this.isDemoMode) {
      userIDs.forEach(demoModeUser => {
        demoModeUser.accountNonLocked = true;
        demoModeUser.failedLoginAttempts = 0;
        demoModeUser.lockTime = null;
      });

      return this.restService
        .put(this.USER_MOD_DEMO_URL + '/unlock', requestBody, {
          'Content-Type': 'application/json',
        });

    } else {
      return this.restService
        .put(this.USER_MOD_URL + '/unlock', requestBody, {
          'Content-Type': 'application/json',
        });
    }


  }

  setUserRole(userIDs: UserSessionData[], newRole: string): Observable<UserModResponseBody> {
    let requestBody: UserModRequestBody = {
      ids: userIDs.flatMap((user) => {
        return user.id;
      }),
      newRole: newRole as AuthorityTypes,
    };
    console.debug("user-mod-service.setUserRole():: requestBody= ", requestBody);

    if (this.isDemoMode) {

      let newAuthorities: Authority[] = [];
      if (newRole === AuthorityTypes.ROLE_ADMIN) {
        newAuthorities = demoModeAdminRole.authorities;
      } else if (newRole === AuthorityTypes.ROLE_MODERATOR) {
        newAuthorities = demoModeModRole.authorities;

      } else if (newRole === AuthorityTypes.ROLE_USER) {
        newAuthorities = demoModeUserRole.authorities;

      } else if (newRole === AuthorityTypes.ROLE_GUEST) {
        newAuthorities = demoModeGuestRole.authorities;
      }

      userIDs.forEach(demoModeUser => {
        demoModeUser.authorities = newAuthorities;
        demoModeUser.roleString = getRoleString(newRole as AuthorityTypes);

      });

      return this.restService
        .put(this.USER_MOD_DEMO_URL + '/roles', requestBody);

    } else {
      return this.restService
        .put(this.USER_MOD_URL + '/roles', requestBody);
    }

  }


  setUserStatus(userIDs: UserSessionData[], newStatus: boolean) {
    let requestBody: UserModRequestBody = {
      ids: userIDs.flatMap((user) => {
        return user.id;
      }),
      newStatus: newStatus
    };
    console.debug("user-mod-service.setUserStatus():: requestBody= ", requestBody);

    if (this.isDemoMode) {

      userIDs.forEach(demoModeUser => {
        demoModeUser.enabled = newStatus;
      });

      return this.restService
        .put(this.USER_MOD_DEMO_URL + '/status', requestBody)

    } else {

      return this.restService
        .put(this.USER_MOD_URL + '/status', requestBody)
    }
  }

  deleteUsers(userIDs: UserSessionData[]): Observable<UserModResponseBody> {
    let requestBody: UserModRequestBody = {
      ids: userIDs.flatMap((user) => {
        return user.id;
      }),
    };
    console.debug("user-mod-service.deleteUsers():: requestBody= ", requestBody);

    if (this.isDemoMode) {

      userIDs.forEach(user => {
        let demoListIndex = this.allUsers.findIndex(demoUser => {
          return demoUser.id === user.id;
        });

        if (demoListIndex > -1) {
          this.allUsers.splice(demoListIndex, 1);
        }
      });
      this._modifiedUsersSub.next(this.allUsers === null ? null : this.allUsers);
      this.selectedUsers = this.allUsers ?? [];

      return this.restService
        .delete(this.USER_MOD_DEMO_URL + '/delete', requestBody);

    } else {

      return this.restService
        .delete(this.USER_MOD_URL + '/delete', requestBody);
    }

  }

  //-------User Mod Actions-------

  resendAccountActivationAction() {
    this.spinnerService.spin();
    this.resendAccountActivationLink(this.validUsers).subscribe({
      next: (resp: UserModResponseBody) => {
        this.spinnerService.stop();
        console.debug("user-mod-service.resendAccountActivationAction():: resp= ", resp);
        this.openResponseDialog('Success', resp.message ?? "");

        this.setModifiedUsersSub(resp.data.users);
      },
      error: (err: UserModResponseBody) => {
        this.spinnerService.stop();
        console.error("user-mod-service.resendAccountActivationAction():: err= ", err);
        this.openResponseDialog('Error', err.message ?? "");
      },
    });
  }


  unlockUserAction() {
    this.spinnerService.spin();
    this.unlockUser(this.validUsers).subscribe({
      next: (resp: UserModResponseBody) => {
        this.spinnerService.stop();
        console.debug("user-mod-service.unlockUserAction():: resp= ", resp);
        this.openResponseDialog('Success', resp.message ?? "");

        this.setModifiedUsersSub(resp.data.users);
      },
      error: (err: UserModResponseBody) => {
        this.spinnerService.stop();
        console.error("user-mod-service.unlockUserAction():: err= ", err);
        this.openResponseDialog('Error', err.message ?? "");
      },
    });
  }


  setRoleAction(newRole: AuthorityTypes) {
    this.spinnerService.spin();
    this.setUserRole(this.validUsers, newRole).subscribe({
      next: (resp: UserModResponseBody) => {
        this.spinnerService.stop();
        console.debug("user-mod-service.setRoleAction():: resp= ", resp);
        this.openResponseDialog('Success', resp.message ?? "");

        this.setModifiedUsersSub(resp.data.users);
      },
      error: (err: UserModResponseBody) => {
        this.spinnerService.stop();
        console.error("user-mod-service.setRoleAction():: err= ", err);
        this.openResponseDialog('Error', err.message ?? "");
      },
    });
  }


  setStatusAction(newStatus: boolean, toggleElement?: MatSlideToggle) {
    this.spinnerService.spin();
    this.setUserStatus(this.validUsers, newStatus).subscribe({
      next: (resp: UserModResponseBody) => {
        this.spinnerService.stop();
        console.debug("user-mod-service.setStatusAction():: resp= ", resp);
        this.openResponseDialog('Success', resp.message ?? "");
        this.setModifiedUsersSub(resp.data.users);

        console.debug("changestatus selectedUsers = ", this.selectedUsers);

      },
      error: (err: UserModResponseBody) => {
        this.spinnerService.stop();
        console.error("user-mod-service.setStatusAction():: err= ", err);

        if (toggleElement) {
          //setStatus request failed, so revert the toggle
          toggleElement.checked = !toggleElement.checked;
        }

        this.openResponseDialog('Error', err.message ?? "");
      }
    });
  }

  deleteAction() {
    this.spinnerService.spin();
    this.deleteUsers(this.validUsers)
      .subscribe({
        next: (resp: UserModResponseBody) => {
          this.spinnerService.stop();
          console.debug("user-mod-service.deleteAction():: resp= ", resp);
          this.openResponseDialog('Success', resp.message ?? "");
          this.setModifiedUsersSub(null);
        },
        error: (err: UserModResponseBody) => {
          this.spinnerService.stop();
          console.error("user-mod-service.deleteAction():: err= ", err);
          this.openResponseDialog('Error', err.message ?? "");
        },
      });

  }


  //-------Validate Actions-------

  /**
   * Validate more than 0 ' + (this.doesapplyusers.length > 1 ? 'users' : 'user') + ' are selected
   * and those ' + (this.doesapplyusers.length > 1 ? 'users' : 'user') + ' apply to the current action
   * 
   * Display the result in a dialog
   * 
   * @param action 
   */
  validateUserModAction(action: UserModActions) {
    this.currentAction = action;
    if (isEmpty(this.selectedUsers)) {
      this.openNoUserDialog();
    } else if (this.selectedUsers.length > 10) {
      this.openTooManySelectedUsersDialog();
    } else {

      if (this.selectedUsers.length > 0) {

        this.invalidText = null;
        this.validText = null;
        this.additionalText = null;

        this.invalidUsers = [];
        this.validUsers = [];

        if (this.currentAction === UserModActions.APPROVE) {
          this.validatePending(true);
        } else if (this.currentAction === UserModActions.DENY) {
          this.validatePending(false);
        } else if (this.currentAction === UserModActions.ACTIVATE) {
          this.validateSetStatus(true);
        } else if (this.currentAction === UserModActions.DEACTIVATE) {
          this.validateSetStatus(false);
        } else if (
          this.currentAction === UserModActions.SET_GUEST ||
          this.currentAction === UserModActions.SET_USER ||
          this.currentAction === UserModActions.SET_MOD ||
          this.currentAction === UserModActions.SET_ADMIN
        ) {
          this.validateSetRole();
        } else if (this.currentAction === UserModActions.CONTACT) {
          // this.validUsers = this.selectedUsers;
          // this.openContactUserDialog();
          return;
        } else if (this.currentAction === UserModActions.DELETE) {
          this.validUsers = this.selectedUsers;

          this.validText = this.currentAction + ' the following ' + (this.validUsers.length > 1 ? 'users' : 'user') + '? ';
          this.additionalText = {
            header: 'This will PERMANENTLY DELETE the ' + (this.validUsers.length > 1 ? 'users' : 'user\'s') + ' info.',
            body: 'The ' + (this.validUsers.length > 1 ? 'users' : 'user') + ' will recieve an email that their account has been deleted.'
          }


        }

        this.openConfirmActionDialog();
      }
    }
  }

  /**
   * Validate the selected users are not in pending status, and can be approved
   */
  validatePending(isApprove: boolean) {
    //Check status is pending
    this.selectedUsers.forEach((user) => {
      !user.enabled && (user.lastLogin === null)
        ? this.validUsers.push(user)
        : this.invalidUsers.push(user);
    });

    //Some users cannot be approved
    if (this.invalidUsers.length > 0) {
      this.invalidText =
        this.currentAction +
        ' action does not apply to the following ' + (this.invalidUsers.length > 1 ? 'users' : 'user') + ' because they are already approved: ';
    }

    //Some users can be approved
    if (this.validUsers.length > 0) {
      this.validText = this.currentAction + ' the following ' + (this.validUsers.length > 1 ? 'users' : 'user') + '? ';
      this.additionalText = {
        header: isApprove ? null : 'This will PERMANENTLY DELETE the ' + (this.validUsers.length > 1 ? 'users' : 'user\'s') + ' info.',
        body: isApprove ? 'The ' + (this.validUsers.length > 1 ? 'users' : 'user') + ' will recieve an email that their account request has been approved.' : 'The ' + (this.validUsers.length > 1 ? 'users' : 'user') + ' will recieve an email that their account request has been denied.'
      }

    }
  }

  /**
   * Validate the selected users are not already the role we're trying to set 
   */
  validateSetRole() {
    //Get RoleType for comaprison
    let roleType: AuthorityTypes = AuthorityTypes.ROLE_GUEST;

    if (this.currentAction === UserModActions.SET_GUEST) {
      roleType = AuthorityTypes.ROLE_GUEST;
    } else if (this.currentAction === UserModActions.SET_USER) {
      roleType = AuthorityTypes.ROLE_USER;
    } else if (this.currentAction === UserModActions.SET_MOD) {
      roleType = AuthorityTypes.ROLE_MODERATOR;
    } else if (this.currentAction === UserModActions.SET_ADMIN) {
      roleType = AuthorityTypes.ROLE_ADMIN;
    }

    //Check user is not already the role we're trying to set 
    this.selectedUsers.forEach(user => {
      if (user.roleString === getRoleString(roleType)) {
        this.invalidUsers.push(user);
      } else {
        this.validUsers.push(user);
      }
    });

    //Some users cannot be set to this role
    if (this.invalidUsers.length > 0) {
      this.invalidText =
        this.currentAction +
        ' action does not apply to the following ' + (this.invalidUsers.length > 1 ? 'users' : 'user') + ' because they are already ' + this.currentAction;
    }

    //Some users can be set to this role
    if (this.validUsers.length > 0) {
      this.validText = this.currentAction + ' for the following ' + (this.validUsers.length > 1 ? 'users' : 'user') + '? ';
    }
  }

  /**
  * Validate the selected users are not already the role we're trying to set 
  */
  validateSetStatus(newStatus: boolean) {
    //Check user is not already the role we're trying to set 
    this.selectedUsers.forEach((user) => {
      if (user.enabled === newStatus) {
        this.invalidUsers.push(user);
      } else {
        this.validUsers.push(user);
      }
    });

    //Some users cannot be set to this role
    if (this.invalidUsers.length > 0) {
      this.invalidText =
        this.currentAction +
        ' action does not apply to the following ' + (this.invalidUsers.length > 1 ? 'users' : 'user') + ' because they are already ' + (newStatus ? 'Enabled' : 'Disabled');
    }

    //Some users can be set to this role
    if (this.validUsers.length > 0) {
      this.validText = this.currentAction + ' the following ' + (this.validUsers.length > 1 ? 'users' : 'user') + '? ';
    }
  }



  //-------Action Dialogs-------


  /**
   * Dialog for the Modify button in the User table rows
   * @param users 
   * @param isSingleUser 
   */
  openModifyUserDialog(users: UserSessionData[], isSingleUser: boolean) {
    const dialogInterface: DialogInterface = {
      dialogTitle: 'Modify ' + (isSingleUser ? users[0].roleString + ' ' + users[0].username : 'Selected Users'),
      cancelButtonLabel: 'Cancel',
      dialogType: isSingleUser ? DialogType.USER_MOD_ACTION : DialogType.MULTIPLE_USER_MOD_ACTION,
      callbackMethod: () => {
        // this.performDialogSubmitMethodOne();
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    });
  }

  /**
   * No user(s) selected to perform action on
   */
  openNoUserDialog() {
    const dialogInterface: DialogInterface = {
      dialogTitle: 'Error - ' + this.currentAction,
      dialogText: [
        {
          header: null,
          body: 'No ' + (this.invalidUsers.length > 1 ? 'users' : 'user') + ' selected.',
        },
      ],
      cancelButtonLabel: 'Close',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    });
  }

  /**
 * No user(s) selected to perform action on
 */
  openTooManySelectedUsersDialog() {
    const dialogInterface: DialogInterface = {
      dialogTitle: 'Error - ' + this.currentAction,
      dialogText: [
        {
          header: null,
          body: 'Too many users selected, maximum is 10',
        },
      ],
      cancelButtonLabel: 'Close',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    });
  }

  openUnlockUserDialog() {
    //Open Dialog
    const dialogInterface: DialogInterface = {
      dialogTitle: 'Unlock Action',
      dialogText: [{
        header: "User " + this.validUsers[0].username + " is locked due to too many failed login attempts.",
        body: "The lock expires on " + this.validUsers[0].lockTime
      },
      {
        header: "Do you want to unlock the user's accout now?",
        body: null
      }],
      cancelButtonLabel: 'No',
      primaryButtonLabel: 'Yes',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
        this.unlockUserAction();
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    });

  }

  /**
   * Confirm, before performing all actions, except contact action
   * 
   * Changes the dialog based on 
   *  if all users apply to the current action,
   *  or all users do not apply to the current action,
   *  or some users apply and some do not 
   */
  openConfirmActionDialog() {
    let dialogText: DialogText[] = [];

    //Add users who do not apply
    dialogText.push({
      header: this.invalidText ?? null,
      body:
        this.invalidUsers.length > 0
          ? this.invalidUsers
            .flatMap((doesNotApplyUser) => {
              return doesNotApplyUser.username;
            })
            .join(', ')
          : null,
    });

    //Add users who do apply
    dialogText.push({
      header: this.validText ?? null,
      body:
        this.validUsers.length > 0
          ? this.validUsers
            .flatMap((doesApplyUser) => {
              return doesApplyUser.username;
            })
            .join(', ')
          : null,
    });

    if (this.additionalText) {
      dialogText.push(this.additionalText);
    }


    //Open Dialog
    const dialogInterface: DialogInterface = {
      dialogTitle: this.currentAction + ' Action',
      dialogText: dialogText,
      cancelButtonLabel: this.validText === null ? 'Close' : 'No',
      primaryButtonLabel: this.validText === null ? undefined : 'Yes',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
        // this.dialogRef.close();
        if (this.currentAction === UserModActions.APPROVE) {
          this.openApproveUserRoleSelectDialog();
        } else if (this.currentAction === UserModActions.DENY) {
          this.deleteAction()
        } else if (this.currentAction === UserModActions.ACTIVATE) {
          this.setStatusAction(true);
        } else if (this.currentAction === UserModActions.DEACTIVATE) {
          this.setStatusAction(false);
        } else if (this.currentAction === UserModActions.SET_GUEST) {
          this.setRoleAction(AuthorityTypes.ROLE_GUEST)
        } else if (this.currentAction === UserModActions.SET_USER) {
          this.setRoleAction(AuthorityTypes.ROLE_USER)
        } else if (this.currentAction === UserModActions.SET_MOD) {
          this.setRoleAction(AuthorityTypes.ROLE_MODERATOR)
        } else if (this.currentAction === UserModActions.SET_ADMIN) {
          this.setRoleAction(AuthorityTypes.ROLE_ADMIN)
        }
        // else if (this.currentAction === UserModActions.SET_ADMIN) {
        //   this.setUserRole(RoleTypes.ROLE_ADMIN);
        // }
        else if (this.currentAction === UserModActions.DELETE) {
          this.deleteAction();
        }

      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    });
  }

  /**
   * Response, after peforming action
   * 
   * @param title 
   * @param response 
   */
  openResponseDialog(title: string, response: string) {
    const dialogInterface: DialogInterface = {
      dialogTitle: title,
      dialogText: [
        {
          header: response,
          body: null,
        },
      ],
      cancelButtonLabel: 'Close',
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
      },
    };
    this.dialog.open(DialogComponent, {
      data: dialogInterface,
    }).afterClosed()
      .subscribe(resp => {
        console.debug('response dialog closed, event=', resp);
        // this.updateAllUsers();
        this.dialog.closeAll();
      });
  }

  /**
   * To approve a user, you must assign a role 
   */
  openApproveUserRoleSelectDialog() {

    //Open the Set Role dialog
    const dialogInterface: DialogInterface = {
      dialogTitle: 'Approve Users',
      dialogText: [
        {
          header: 'Select a role to approve the following ' + (this.validUsers.length > 1 ? 'users' : 'user') + '',
          body: this.validUsers
            .flatMap((doesApplyUser) => {
              return doesApplyUser.username;
            })
            .join(', '),
        },
      ],
      cancelButtonLabel: 'Cancel',
      dialogType: DialogType.APPROVE_USER,
      callbackMethod: () => {

      },
    };

    this.dialog
      .open(DialogComponent, {
        data: dialogInterface,

      })
      .afterClosed()
      .subscribe((resp) => {
        // this.dialog.closeAll();
      });
  }

  //TODO: Implement Contact Users functionality
  // openContactUserDialog() {
  //   //Open the Set Role dialog

  //   let dialogBody = "";
  //    this.validUsers.forEach( user =>{
  //     dialogBody += user.email + " (" + user.username + "), ";
  //   });
  //   // body.
  //   const dialogInterface: DialogInterface = {
  //     dialogTitle: 'Contact ' + (this.validUsers.length > 1 ? 'Users' : 'User'),
  //     dialogText: [
  //       {
  //         header: 'To:',
  //         body: dialogBody
  //       },
  //       {
  //         header: 'Subject:',
  //         body: "Contact from AshDelaCruz.com"
  //       },
  //       {
  //         header: 'Message:',
  //         body: null
  //       },

  //     ],
  //     cancelButtonLabel: 'Cancel',
  //     primaryButtonLabel: 'Submit',
  //     dialogType: DialogType.CONTACT,
  //     callbackMethod: () => {

  //     },
  //   };

  //   this.dialog
  //     .open(DialogComponent, {
  //       data: dialogInterface,

  //     })
  //     .afterClosed()
  //     .subscribe((resp) => {
  //       // this.dialog.closeAll();
  //     });

  // }


  //-------Getters and Setters-------

  get modifiedUsers$() {
    return this._modifiedUsersSub.asObservable();
  }

  setModifiedUsersSub(users: UserSessionData[] | null) {

    if (!this.isDemoMode) {
      this._modifiedUsersSub.next(users === null ? null : users);
      this.selectedUsers = users ?? [];
    }
  }

}
