import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dataName } from '../interfaces/data';

@Injectable({
  providedIn: 'root',
})
export class ApiUser {
  url = 'http://localhost:3000/user';
  constructor(private http: HttpClient) {}
  getUsers(): Observable<dataName[]> {
    return this.http.get<dataName[]>(this.url);
  }
  saveUsers(user: dataName): Observable<dataName> {
    return this.http.post<dataName>(this.url, user);
  }
  deleteUser(id: string): Observable<dataName> {
    return this.http.delete<dataName>(this.url + '/' + id);
  }
  getSelectedUser(id: string): Observable<dataName> {
    return this.http.get<dataName>(this.url + '/' + id);
  }
  updateUser(user: dataName):Observable<dataName>{
    return this.http.put<dataName>(this.url + '/' + user.id, user);

  }
}
