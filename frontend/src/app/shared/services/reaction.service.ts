
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reaction, ReactionList } from '../models/reaction.model';
import { AutoCompleteItem } from '../models/common';

const baseUrl = '/api/reaction';

@Injectable({
  providedIn: 'root'
})

export class ReactionService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ReactionList> {
    return this.http.get<ReactionList>(baseUrl);
  }

  getFilteredData(params: string): Observable<ReactionList> {
    return this.http.get<ReactionList>(baseUrl + params);
  }

  listAutocomplete(query: string, limit: number): Observable<AutoCompleteItem[]> {
    const params = {
      query,
      limit: limit.toString()
    };
    return this.http.get<AutoCompleteItem[]>(`${baseUrl}/autocomplete`, { params });
  }

  getById(id: string): Observable<Reaction> {
    return this.http.get<Reaction>(`${baseUrl}/${id}`);
  }

  create(data: Reaction): any {
    return this.http.post(`${baseUrl}`, {data});
  }

  update(data: any, id: string): any {
    return this.http.put(`${baseUrl}/${id}`, {data, id});
  }

  delete(id: string): any {
    return this.http.delete(`${baseUrl}/${id}`);
  }

}

