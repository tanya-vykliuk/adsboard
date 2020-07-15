import { Component, OnInit } from '@angular/core';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { Sort } from '@angular/material/sort';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TokenStorageService } from '../../services/token-storage.service';

export interface Advertisement {
  id: number;
  title: string;
  short_description: string;
  published: boolean;
  status: string;
  create_date: Date;
  last_modify_date: Date;
  category_id: number;
  category_name: string;
}

@Component({
  selector: 'app-my-ads-list',
  templateUrl: './my-ads-list.component.html',
  styleUrls: ['./my-ads-list.component.less']
})
export class MyAdsListComponent implements OnInit {
  adslist;
  advertisementlist: Advertisement[] = [];
  sortedData: Advertisement[];
  message;
  error;

  constructor(private advertisementService: AdvertisementService, 
    private snackBar:SnackbarService,
    private tokenStorage: TokenStorageService ) {    
    this.retriveAdvertisements();
  }

  sortData(sort: Sort) {
    const data = this.advertisementlist.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
    //  this.sortedData.paginator = this.paginator;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'statusSmall': return compare(a.status, b.status, isAsc);
        case 'title': return compare(a.title, b.title, isAsc);
        case 'short_description': return compare(a.short_description, b.short_description, isAsc);
        case 'category_name': return compare(a.category_name, b.category_name, isAsc);
        case 'published': return compare(a.published, b.published, isAsc);
        case 'publishedSmall': return compare(a.published, b.published, isAsc);
        default: return 0;
      }
    });
  }

  ngOnInit() {
  }
  retriveAdvertisements(){
    this.advertisementService.getAllForUser(this.tokenStorage.getUser().id)
    .subscribe(
      data => {
        this.adslist = data;       
        this.advertisementlist = this.adslist;
        this.sortedData = this.advertisementlist.slice();                  
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }

  publishAdvertisement(advertisement_id, flag, arrayKey){
    this.advertisementService.publishAdvertisement({'id':advertisement_id, 'flag':flag})
    .subscribe(
      data => {                    
        this.message = data;
        if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');} 
    
        let revFlag=true;
        if(flag == 0){revFlag=false;}
        this.sortedData[arrayKey].published = revFlag;
      },
      error => {
       this.snackBar.openSnackBar(error.error,'error');
      });
  }

  deleteAdvertisement(advertisement_id: number, arrayKey) {
    if(confirm("Are you sure that you want delete advertisement")) {
      this.advertisementService.deleteAdvertisement({'id':advertisement_id})
      .subscribe(
        data => {  
          this.message = data;   
          if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');}  
          this.error = data;
          if(this.error.error){this.snackBar.openSnackBar(this.error.error,'error');}  
          delete this.advertisementlist[arrayKey]; 
        },
        error => {
          this.snackBar.openSnackBar(error.error,'error');
        });
    }
  }
}
function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}