
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messages, MessagesList } from '../models/messages.model';
import { AutoCompleteItem } from '../models/common';

const baseUrl = '/api/messages';

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<MessagesList> {
    return this.http.get<MessagesList>(baseUrl);
  }

  getFilteredData(params: string): Observable<MessagesList> {
    return this.http.get<MessagesList>(baseUrl + params);
  }

  listAutocomplete(query: string, limit: number): Observable<AutoCompleteItem[]> {
    const params = {
      query,
      limit: limit.toString()
    };
    return this.http.get<AutoCompleteItem[]>(`${baseUrl}/autocomplete`, { params });
  }

  getById(id: string): Observable<Messages> {
    return this.http.get<Messages>(`${baseUrl}/${id}`);
  }

  create(data: Messages): any {
    return this.http.post(`${baseUrl}`, {data});
  }

  update(data: any, id: string): any {
    return this.http.put(`${baseUrl}/${id}`, {data, id});
  }

  delete(id: string): any {
    return this.http.delete(`${baseUrl}/${id}`);
  }

}

