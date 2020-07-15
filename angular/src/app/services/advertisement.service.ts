import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(baseUrl+'advertisements');
  }
  
  getAllForUser(id){   
    return this.http.get(baseUrl+'user/getAllForUser?id='+id);
  }
  getAllForManager(){   
    return this.http.get(baseUrl+'user/getAllForManager');
  }

  get(advertisement_id){    
    return this.http.get(baseUrl+'advertisements/'+advertisement_id);
  }

  CountWaitingAdvertisements(){
    return this.http.get(baseUrl+'countwaitingadv');
  }

  createAdvertisement(advertisementForm){
    //console.log(advertisementForm);
    return this.http.post(baseUrl+'createadvertisement', advertisementForm);
  }

  approveAdvertisement(postData){
    console.log('Service approveAdvertisement');
    return this.http.post(baseUrl+'approveAdvertisement', postData);
  }  
  rejectAdvertisement(postData){
    console.log('Service rejectAdvertisement');
    return this.http.post(baseUrl+'rejectAdvertisement', postData);
  }


  publishAdvertisement(postData){
    console.log('Service publishAdvertisement');
    return this.http.post(baseUrl+'publishAdvertisement', postData);
  }
  
  deleteAdvertisement(postData){
    console.log('Service deleteAdvertisement');
    return this.http.post(baseUrl+'deleteAdvertisement', postData);
  }
}
