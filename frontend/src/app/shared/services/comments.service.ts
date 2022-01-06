
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comments, CommentsList } from '../models/comments.model';
import { AutoCompleteItem } from '../models/common';

const baseUrl = '/api/comments';

@Injectable({
  providedIn: 'root'
})

export class CommentsService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<CommentsList> {
    return this.http.get<CommentsList>(baseUrl);
  }

  getFilteredData(params: string): Observable<CommentsList> {
    return this.http.get<CommentsList>(baseUrl + params);
  }

  listAutocomplete(query: string, limit: number): Observable<AutoCompleteItem[]> {
    const params = {
      query,
      limit: limit.toString()
    };
    return this.http.get<AutoCompleteItem[]>(`${baseUrl}/autocomplete`, { params });
  }

  getById(id: string): Observable<Comments> {
    return this.http.get<Comments>(`${baseUrl}/${id}`);
  }

  create(data: Comments): any {
    return this.http.post(`${baseUrl}`, {data});
  }

  update(data: any, id: string): any {
    return this.http.put(`${baseUrl}/${id}`, {data, id});
  }

  delete(id: string): any {
    return this.http.delete(`${baseUrl}/${id}`);
  }

}

