
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Groups, GroupsList } from '../models/groups.model';
import { AutoCompleteItem } from '../models/common';

const baseUrl = '/api/groups';

@Injectable({
  providedIn: 'root'
})

export class GroupsService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<GroupsList> {
    return this.http.get<GroupsList>(baseUrl);
  }

  getFilteredData(params: string): Observable<GroupsList> {
    return this.http.get<GroupsList>(baseUrl + params);
  }

  listAutocomplete(query: string, limit: number): Observable<AutoCompleteItem[]> {
    const params = {
      query,
      limit: limit.toString()
    };
    return this.http.get<AutoCompleteItem[]>(`${baseUrl}/autocomplete`, { params });
  }

  getById(id: string): Observable<Groups> {
    return this.http.get<Groups>(`${baseUrl}/${id}`);
  }

  create(data: Groups): any {
    return this.http.post(`${baseUrl}`, {data});
  }

  update(data: any, id: string): any {
    return this.http.put(`${baseUrl}/${id}`, {data, id});
  }

  delete(id: string): any {
    return this.http.delete(`${baseUrl}/${id}`);
  }

}

