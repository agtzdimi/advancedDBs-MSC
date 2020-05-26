import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HighlightService {
    public originalText: string = '';
    public keyword: string = '';

    constructor(
    ) {

    }

}
