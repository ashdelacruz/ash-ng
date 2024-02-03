import { SelectionModel } from "@angular/cdk/collections";
import { UserSessionData } from "./user-session";
import { Observable } from "rxjs";

export interface DialogInterface {
    cancelButtonLabel: string;
    secondaryButtonLabel?: string;
    primaryButtonLabel?: string;
    dialogTitle: string;
    dialogText?: DialogText[];
    dialogType: DialogType;
    dialogTimeoutSeconds?: number;
    callbackMethod: () => any | void;

  }

  export interface DialogText {
    header: string | null;
    body: string | null;
  }


  export enum DialogType {
    LOGIN,
    BASIC, 
    APPROVE_USER,
    CONTACT,
    USER_MOD_ACTION,
    MULTIPLE_USER_MOD_ACTION
  }