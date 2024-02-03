/**
 * Jokes API Responses
 */

// Example jokes response
// {
//     "error": false,
//     "amount": 2,
//     "jokes": [
//         {
//             "category": "Programming",
//             "type": "single",
//             "joke": "If Bill Gates had a dime for every time Windows crashed ... Oh wait, he does.",
//             "flags": {
//                 "nsfw": false,
//                 "religious": false,
//                 "political": false,
//                 "racist": false,
//                 "sexist": false,
//                 "explicit": false
//             },
//             "id": 22,
//             "safe": true,
//             "lang": "en"
//         },
//         {
//             "category": "Programming",
//             "type": "single",
//             "joke": "Debugging is like being the detective in a crime movie where you're also the murderer at the same time.",
//             "flags": {
//                 "nsfw": false,
//                 "religious": false,
//                 "political": false,
//                 "racist": false,
//                 "sexist": false,
//                 "explicit": false
//             },
//             "id": 42,
//             "safe": true,
//             "lang": "en"
//         }
//     ]
// }

export interface JokeOptions {
    blacklistFlags: string[] | null,
    type: string,
    lang: string,
    amount: string
}

export interface InfoOptions {
    format: string | null,
    lang: string | null
}

export interface MultipleJokesResponse {
    error: string,
    amount?: number,
    jokes?: JokeResponse[]

    additionalInfo?: string,
    causedBy?: string[],
    code?: number,
    internalError?: boolean,
    message?: string,
    timestamp?: number
}

export interface JokeResponse {
    error: string,
    category?: string,
    type: string,
    joke?: string,
    setup?: string,
    delivery?: string,
    flags?: Flag[],
    id: number,
    safe?: boolean,
    lang?: string,

    additionalInfo?: string,
    causedBy?: string[],
    code?: number,
    internalError?: boolean,
    message?: string,
    timestamp?: number
}

export interface Flag {
    nsfw: boolean,
    religious: boolean,
    political: boolean,
    racist: boolean,
    sexist: boolean,
    explicit: boolean,
}

export interface InfoResponse {
    error: string,
    version: string,
    jokes: JokeInfo,
    formats: string[],
    jokeLanguages: number,
    systemLanguages: number,
    info: string,
    timestamp: number
}

export interface JokeInfo {
    totalCount: number,
    categories: string[],
    flags: string[],
    types: string[],
    submissionURL: string,
    idRange: IDRange,
    safeJokes: LangCount[]
}

export interface IDRange {
    cs: number[],
    de: number[],
    en: number[],
    pt: number[],
    es: number[],
    fr: number[]
}

export interface LangCount {
    lang: string,
    count: number
}

export interface CategoryResponse {
    error: string,
    categories: string[],
    categoryAliases: AliasResolved[],
    timestamp: number
}

export interface AliasResolved {
    alias: string,
    resolved: string
}

export interface SupportedLanguagesResponse {
    defaultLanguage: string,
    jokeLanguages: string[],
    systemLanugages: string[],
    possibleLanguages: LangCodeName[],
    timestamp: number
}

export interface LangCodeName {
    code: string,
    name: string
}