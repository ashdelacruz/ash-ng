export interface ListOfBooksResponse {
    count: number;
    next?: string;
    previous?: string;
    results: BookInfo[];
}

export interface BookInfo {
    id: number;
    title: string;
    authors: AuthorInfo[];
    translators: TranslatorInfo[];
    subjects: string[];
    bookshelves: string[];
    languages: string[];
    copyright: boolean;
    media_type: string;
    formats: FormatInfo;
    download_count: number;
}

export interface AuthorInfo {
    name?: string;
    birth_year?: number;
    death_year?: number;
}

export interface TranslatorInfo {
    name?: string;
    birth_year?: number;
    death_year?: number;
}

export interface FormatInfo {
    "text/plain": string;
    "application/octet-stream": string
    "text/plain; charset=us-ascii": string;
    "application/x-mobipocket-ebook": string;
    "application/epub+zip": string;
    "image/jpeg": string;
    "text/html": string;
    "application/rdf+xml": string;
}

export interface ListOfBooksRequestParams {
    ids?: string,
    search?: string,
    topic?: string,
    sort?: string,
    author_year_start?: number,
    author_year_end?: number,
    copyright?: string,
    page?: number
}
