import { Component } from "@angular/core";

export interface Card {
    cardTitle: string,
    cardContent: any,
    columnSpan: number,
    rowSpan: number,
    callbackMethod?: () => any | void;
}
