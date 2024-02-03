/**
 * ImgFlip Memes API Responses
 */

export interface MemesResponse {
    success: boolean;
    error_message?: string;
    data?: MemeList;
}

export interface MemeList {
    memes: Meme[];
}

export interface Meme {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
    box_count: number;
    captions: number;
}

export interface CreateMemeResponse {
    success: boolean;
    error_message?: string;
    data?: MemeLinks;
}

export interface MemeLinks {
    url: string;
    page_url: string;
}

export interface MemeRequestBody {
    template_id: string;
    username: string;
    password: string;
    text0: string;
    text1: string;
    font?: string; //e.g. impact or arial
    max_font_size?: string //e.g. 50px
}

