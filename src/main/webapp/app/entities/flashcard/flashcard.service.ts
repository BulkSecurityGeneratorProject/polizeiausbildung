import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Flashcard } from './flashcard.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class FlashcardService {

    private resourceUrl = 'api/flashcards';
    private resourceSearchUrl = 'api/_search/flashcards';
    private queryCompleteUrl = 'api/flashcardQuery';

    constructor(private http: Http) { }

    create(flashcard: Flashcard): Observable<Flashcard> {
        const copy = this.convert(flashcard);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(flashcard: Flashcard): Observable<Flashcard> {
        const copy = this.convert(flashcard);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Flashcard> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    queryComplete(query: string): Observable<ResponseWrapper> {
        console.log("query: "+query);
        const params: URLSearchParams = new URLSearchParams();
        params.set('flashcardQuery', query);

        return this.http.get(this.queryCompleteUrl, {
            search: params
        }).map((res: Response) => res);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(flashcard: Flashcard): Flashcard {
        const copy: Flashcard = Object.assign({}, flashcard);
        return copy;
    }
}
