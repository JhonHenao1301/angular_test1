import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from './response.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http:HttpClient
  ) { }

  private BASE_URL = 'https://api.github.com/'
  private API_URL = 'search/users?q='
  private LIMIT = `&per_page=${10}`

  searchUsers(username: string) {
    return this.http.get<Response>(`${this.BASE_URL}${this.API_URL}${username}${this.LIMIT}`)
  }

  searchOneUser(username: string){
    return this.http.get<any>(`${this.BASE_URL}users/${username}`)
  }
}
