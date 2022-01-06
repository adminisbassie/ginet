import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts, PostsList } from '../models/posts.model';
import { AutoCompleteItem } from '../models/common';

const baseUrl = '/api/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PostsList> {
    return this.http.get<PostsList>(baseUrl);
  }

  getFilteredData(params: string): Observable<PostsList> {
    return this.http.get<PostsList>(baseUrl + params);
  }

  listAutocomplete(
    query: string,
    limit: number,
  ): Observable<AutoCompleteItem[]> {
    const params = {
      query,
      limit: limit.toString(),
    };
    return this.http.get<AutoCompleteItem[]>(`${baseUrl}/autocomplete`, {
      params,
    });
  }

  getById(id: string): Observable<Posts> {
    return this.http.get<Posts>(`${baseUrl}/${id}`);
  }

  create(data: Posts): any {
    return this.http.post(`${baseUrl}`, { data });
  }

  update(data: any, id: string): any {
    return this.http.put(`${baseUrl}/${id}`, { data, id });
  }

  delete(id: string): any {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
