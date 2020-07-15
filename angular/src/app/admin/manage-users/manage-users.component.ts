import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Sort } from '@angular/material/sort';
import { SnackbarService } from 'src/app/services/snackbar.service';

export interface User {
  id: number;
  name: string;
  email: string;
  status: boolean;
  registration_date: Date;
  last_visit_date: Date;
  role_id: number;
  role_name: string;
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.less']
})
export class ManageUsersComponent implements OnInit {
usList;
usersList: User[] = [];
sortedData: User[];
message;
error;
constructor(private userService: UserService,  private snackBar:SnackbarService) { 
  this.getUsersList();
}

sortData(sort: Sort) {
  const data = this.usersList.slice();
  if (!sort.active || sort.direction === '') {
    this.sortedData = data;
    return;
  }

  this.sortedData = data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'id': return compare(a.id, b.id, isAsc);
      case 'name': return compare(a.name, b.name, isAsc);
      case 'email': return compare(a.email, b.email, isAsc);
      case 'registration_date': return compare(a.registration_date, b.registration_date, isAsc);
      case 'last_visit_date': return compare(a.last_visit_date, b.last_visit_date, isAsc);
      case 'status': return compare(a.status, b.status, isAsc);
      case 'role_id': return compare(a.role_id, b.role_id, isAsc);
      case 'role_name': return compare(a.role_name, b.role_name, isAsc);
      default: return 0;
    }
  });
}

  ngOnInit() {
  }
  
  getUsersList(){
    this.userService.getUsers()
    .subscribe(
      data => {
        this.usList = data;
        this.usersList = this.usList;
        this.sortedData = this.usersList.slice(); 
        this.message = data;   
        if(this.message.message) this.snackBar.openSnackBar(this.message.message,'success');
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }

}


function compare(a: number | string | boolean | Date, b: number | string | boolean| Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}