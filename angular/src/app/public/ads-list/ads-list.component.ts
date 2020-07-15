import { Component, OnInit, Inject } from '@angular/core';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';

export interface DialogData {
  advertisement_id: string;
  title: string;
  category_name: string;
  description: string;
  create_date: Date;
}

@Component({
  selector: 'app-ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.less']
})

export class AdsListComponent implements OnInit {

adslist;
advertisement_id: string;
dialogRef:any;

  constructor(private advertisementService: AdvertisementService, 
    public dialog: MatDialog,
    private snackBar:SnackbarService) {
    this.retriveAdvertisements();
  }

  
  ngOnInit(){ }

  retriveAdvertisements(){
    this.advertisementService.getAll().subscribe(
      data => this.adslist = data,
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }

  openDialog(id: string): void {
      this.advertisement_id=id;
      this.getAdvertisement( this.advertisement_id);
  }

  getAdvertisement(advertisement_id){
    this.advertisementService.get(advertisement_id).subscribe(
      data => {
        const {
          title,
          category_name,
          description,
          create_date,
          user_name,
          user_email
        } = data[0];

        this.dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '350px',
          data: {title, category_name, description, create_date, user_name, user_email}
        });

      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
  });
  }
}

@Component({
  selector: 'advapp-advertisementertisement',
  templateUrl: '../advertisement/advertisement.component.html',
  styleUrls: ['../advertisement/advertisement.component.less']
})

export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void { this.dialogRef.close(); }
}
