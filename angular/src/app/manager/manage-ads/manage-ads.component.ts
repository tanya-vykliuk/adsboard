import { Component, OnInit, Inject } from '@angular/core';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TokenStorageService } from '../../services/token-storage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  advertisement_id:number;
  reason: string;
}

export interface Advertisement {
  id: number;
  title: string;
  short_description: string;
  description: string;
  published: boolean;
  status: string;
  create_date: Date;
  last_modify_date: Date;
  category_id: number;
  category_name: string;
}

@Component({
  selector: 'app-manage-ads',
  templateUrl: './manage-ads.component.html',
  styleUrls: ['./manage-ads.component.less']
})
export class ManageAdsComponent implements OnInit {
  adslist;
  advertisementlist: Advertisement[] = [];
  sortedData: Advertisement[];
  error;
  message;
  dialogRef: any;

  constructor(private advertisementService: AdvertisementService, 
    private snackBar:SnackbarService, public dialog: MatDialog, 
    private tokenStorage: TokenStorageService) {    
    this.retriveAdvertisements();
  }
 
  ngOnInit() {
  }

  retriveAdvertisements(){
    this.advertisementService.getAllForManager()
    .subscribe(
      data => {
        this.adslist = data;
        this.advertisementlist = this.adslist;
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }

  approveAdvertisement(advertisement_id) {
   // console.log('approveAdvertisement')
    return this.advertisementService.
    approveAdvertisement({'id':advertisement_id,'reviewerId':this.tokenStorage.getUser().id}).subscribe(
      data => {
        console.log(data);
        this.error = data;    
        this.message = data;  
        if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');}  
        this.retriveAdvertisements();              
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }


  openDialog(id: string): void {
    this.dialogRef = this.dialog.open(DialogReasonOverview, {
      width: '350px',
      data: {advertisement_id: id , reason:''}
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.retriveAdvertisements();
    });
  }

  
}
export class ExpansionOverviewExample {
  panelOpenState = false;
}



@Component({ 
  template: '<h1 mat-dialog-title>Fill the reason of rejecting</h1><div mat-dialog-content>'+
  '<mat-form-field><input matInput [(ngModel)]="data.reason"></mat-form-field></div>'+
  '<div mat-dialog-actions><button mat-button (click)="onNoClick()">No Thanks</button>'+
    '<button mat-button (click)="rejectAdvertisement(data.advertisement_id, data.reason)" '+
    'mat-dialog-close  cdkFocusInitial>Ok</button>'+
  '</div>',
})


export class DialogReasonOverview {
  error;
  message;
  adslist;
  advertisementlist;

  constructor(
    public dialogRef: MatDialogRef<DialogReasonOverview>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private advertisementService: AdvertisementService, 
    private snackBar:SnackbarService, private tokenStorage: TokenStorageService) { }


  ngOnInit() {}

  onNoClick(): void { this.dialogRef.close(); }

  retriveAdvertisements(){
    this.advertisementService.getAllForManager()
    .subscribe(
      data => {
        this.adslist = data;
        this.advertisementlist = this.adslist;
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }


  rejectAdvertisement(advertisement_id, reason){
     return this.advertisementService.
     rejectAdvertisement({'id':advertisement_id,'reason':reason,'reviewerId':this.tokenStorage.getUser().id}).subscribe(
       data => {
         console.log(data);
         this.error = data;    
         this.message = data;  
         //this.retriveAdvertisements();  
        window.location.reload();
         if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');}      
       },
       error => {
         this.snackBar.openSnackBar(error.error,'error');
       });
   }

}