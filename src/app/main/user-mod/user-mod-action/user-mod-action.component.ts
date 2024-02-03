import { Component, Input, OnInit } from '@angular/core';
import { AuthorityTypes, RoleStrings, UserSessionData } from 'src/app/interfaces/user-session';
import { MobileService } from 'src/app/services/mobile.service';
import { UserModActions, UserModService } from 'src/app/services/user-mod.service';
import { UserSessionService } from 'src/app/services/user-session.service';


@Component({
  selector: 'app-user-mod-action',
  templateUrl: './user-mod-action.component.html',
  styleUrls: ['./user-mod-action.component.scss']
})
export class UserModActionComponent implements OnInit {

  //-------Action Labels-------
  public approveText = UserModActions.APPROVE + ' Pending';
  public denyText = UserModActions.DENY + ' Pending';

  public resendActivationText = UserModActions.RESEND;

  public activateText = UserModActions.ACTIVATE + ' Users';
  public deactivateText = UserModActions.DEACTIVATE + ' Users';

  public guestText = UserModActions.SET_GUEST + ' Role';
  public userText = UserModActions.SET_USER + ' Role';
  public modText = UserModActions.SET_MOD + ' Role';
  public adminText = UserModActions.SET_ADMIN + ' Role';

  public contactText = UserModActions.CONTACT + ' Users';

  public unameText = 'Change ' + UserModActions.CHANGE_UNAME;
  public emailText = 'Change ' + UserModActions.CHANGE_EMAIL;

  public deleteText = UserModActions.DELETE + ' Users';

  public currentUname: string;
  public currentEmail: string;



  //-------Bools-------
  @Input() isSingleUser: boolean;
  @Input() isApprovingUser: boolean = false;

  public isModifyingGuest: boolean = false;
  public isModifyingUser: boolean = false;
  public isModifyingMod: boolean = false;
  public isModifyingAdmin: boolean = false;
  public isModifyingActiveUser: boolean = false; //A user whose account is active
  public isModifyingApprovedUser: boolean = false; //A user who has been approved but requires account activation via login link

  public isLandscape: boolean;

  //Used to restrict user mod actions
  //e.g. only Admins are allowed to delete users 
  public isModSession: boolean;
  public isAdminSession: boolean;
  public isDemoMode: boolean;


  public selectedUsers: UserSessionData[] = [];



  constructor(
    private mobileService: MobileService,
    private session: UserSessionService,
    private userModService: UserModService,
    // @Inject(MAT_DIALOG_DATA)
    // public dialogData: DialogInterface,
    // public dialog: MatDialog
  ) {


    this.isDemoMode = this.userModService.isDemoMode;

    this.isModSession = this.isDemoMode ? true : this.session.isModSession();
    this.isAdminSession = this.isDemoMode ? true : this.session.isAdminSession();

    

    this.mobileService.isLandscapeSub$.subscribe(obs => {
      this.isLandscape = obs;
    });

  }

  ngOnInit(): void {
    this.selectedUsers = this.userModService.selectedUsers;

    this.activateText = this.activateText


    if (this.isSingleUser) {

      this.activateText = UserModActions.ACTIVATE + ' User';
      this.deactivateText = UserModActions.DEACTIVATE + ' User';
      this.contactText = UserModActions.CONTACT + ' User';
      this.deleteText = UserModActions.DELETE + ' User';


      //When not using multiselect, you can modify user uname and email
      this.currentUname = this.selectedUsers[0].username;
      this.currentEmail = this.selectedUsers[0].email;

      //Disable the Set Role button for the user's current role 
      //e.g. Can't set a user as mod if they're already a mod 
      let primaryRole: RoleStrings | null = this.selectedUsers[0].roleString;

      if (primaryRole == RoleStrings.ADMIN) {
        this.isModifyingAdmin = true;
      } else if (primaryRole == RoleStrings.MODERATOR) {
        this.isModifyingMod = true;
      } else if (primaryRole == RoleStrings.USER) {
        this.isModifyingUser = true;
      } else if (primaryRole == RoleStrings.GUEST) {
        this.isModifyingGuest = true;
      }

      this.isModifyingActiveUser = this.selectedUsers[0].enabled && this.selectedUsers[0].lastLogin !== null;
      this.isModifyingApprovedUser = this.selectedUsers[0].enabled && this.selectedUsers[0].lastLogin === null;
    } 



  }

  //-------Button Handlers------
  onApproveBtnClick() {
    this.userModService.validateUserModAction(UserModActions.APPROVE);
  }

  onDenyBtnClick() {
    this.userModService.validateUserModAction(UserModActions.DENY);
  }

  onActivateBtnClick() {
    this.userModService.validateUserModAction(UserModActions.ACTIVATE);
  }

  onResendBtnClick() {
    this.userModService.validUsers = [this.selectedUsers[0]]
    this.userModService.resendAccountActivationAction();
  }

  onDeactivateBtnClick() {
    this.userModService.validateUserModAction(UserModActions.DEACTIVATE);
  }

  onRoleBtnClick(newRole: string) {
    if(this.isApprovingUser) {
      let newAuthority = this.getAuthTypeFromUserModRoleAction(newRole as UserModActions);
   
      this.userModService.setRoleAction(newAuthority);
    } else {

      this.userModService.validateUserModAction(newRole as UserModActions);
    }
  }

  onContactUserBtnClick() {
    this.userModService.validateUserModAction(UserModActions.CONTACT);
  }

  onDeleteBtnClick() {
    this.userModService.validateUserModAction(UserModActions.DELETE);
  }

  getAuthTypeFromUserModRoleAction(newRole: UserModActions) {
    if(newRole === UserModActions.SET_ADMIN) {
      return AuthorityTypes.ROLE_ADMIN;
    } else if(newRole === UserModActions.SET_MOD) {
      return AuthorityTypes.ROLE_MODERATOR;
    } else if(newRole === UserModActions.SET_USER) {
      return AuthorityTypes.ROLE_USER;
    } else if(newRole === UserModActions.SET_GUEST) {
      return AuthorityTypes.ROLE_GUEST;
    } else  {
      return AuthorityTypes.UNKNOWN;
    }
  }


}
