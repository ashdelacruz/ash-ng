import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';
import { JokeService } from './joke.service';
import { InfoResponse, SupportedLanguagesResponse } from '../interfaces/jokes';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { isEmpty } from '../common/utils';
import { MemesResponse } from '../interfaces/meme-generator';
import { MemeGeneratorService } from './meme-generator.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private jokeInfo: InfoResponse = {} as InfoResponse;
  private supportedLanguages: SupportedLanguagesResponse = {} as SupportedLanguagesResponse;

  private availableMemes: MemesResponse = {} as MemesResponse;

  constructor(
    private userSessionService: UserSessionService,
    private jokeService: JokeService,
    private memeGenService: MemeGeneratorService
  ) { }

  //Jokes
  getJokesInfo(): Observable<InfoResponse> {
    let jokeInfo = this.jokeInfo;

    if (isEmpty(jokeInfo)) {
      // //console.log("metadata.jokes.getJokesInfo():: jokeInfo does not exist, retrieve it again");
      return this.jokeService.getJokesInfo().pipe(
        tap(resp => {
          resp.jokes.categories.splice(0, 1); //remove "Any" category as it is the default
          // //console.log(resp.jokes.categories);
          this.jokeInfo = resp;
          return resp;
        }),
        catchError(err => {
          // //console.log("metadata.jokes.getJokesInfo():: ERROR - " + err);
          return throwError(() => err);
        }));
    }

    // //console.log("metadata.jokes.getJokesInfo():: jokeInfo already exists");
    // //console.log(jokeInfo.jokes.categories);
    return of(jokeInfo);
  }

  getSupportedLanguages(): Observable<SupportedLanguagesResponse> {
    let supportedLanguages = this.supportedLanguages;

    if (isEmpty(supportedLanguages)) {
      //console.log("metadata.jokes.getSupportedLanguages():: supportedLanguages does not exist, retrieve it again");
      return this.jokeService.getSupportedLanguages().pipe(
        tap(resp => {
          this.supportedLanguages = resp;
          return resp;
        }
        ),
        catchError(err => {
          //console.log("metadata.jokes.getSupportedLanguages():: ERROR - " + err);
          return throwError(() => err);
        }));
    }
    //console.log("metadata.jokes.getSupportedLanguages():: supportedLanguages already exists");
    return of(supportedLanguages);
  }

  //Meme Generator
  getMemes(): Observable<MemesResponse> {
    let availableMemes = this.availableMemes;

    if(isEmpty(availableMemes)) {
      //console.log("metadata.memes.getMemes():: availableMemes does not exist, retrieve it again");
      return this.memeGenService.getMemes().pipe(
        tap(resp => {
          this.availableMemes = resp;
          return resp;
        }
        ),
        catchError(err => {
          //console.log("metadata.memes.getMemes():: ERROR - " + err);
          return throwError(() => err);
        }));
    }

    //console.log("metadata.memes.getMemes():: availableMemes already exists");
    return of(availableMemes);
  }

}
