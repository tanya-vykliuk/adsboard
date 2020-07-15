import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getAll() {
    console.log('getAll    ',baseUrl+'getCategories');
    return this.http.get(baseUrl+'getCategories');
  }
  get(id) {
    console.log('get    ',baseUrl+'getCategory/'+id);
    return this.http.get(baseUrl+'getCategory/'+id);
  }

  deleteCategory(postData){
    console.log('Service deleteCategory');
    return this.http.post(baseUrl+'deleteCategory', postData);
  }

  saveCategory(postData){
    console.log('Service saveCategory '+baseUrl+'saveCategory');
    return this.http.post(baseUrl+'saveCategory', postData);
  }

}
