import { Component, OnInit, Inject } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';

export interface Category { 
  id: number;
  name: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less']
})

export class CategoriesComponent implements OnInit {
categories: Category[] = [];
sortedData: Category[];
catlist;

error;
message;

dialogRef:any;
id;
category;
name;
new_name;

constructor(private categoryService: CategoryService, 
            public dialog: MatDialog, 
            private snackBar:SnackbarService) {
  this.getCategories();
}
ngOnInit() {}
sortData(sort: Sort) {
  const data = this.categories.slice();
  if (!sort.active || sort.direction === '') {
    this.sortedData = data;
    return;
  }

  this.sortedData = data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'id': return compare(a.id, b.id, isAsc);
      case 'name': return compare(a.name, b.name, isAsc);
      default: return 0;
    }
  });
}

openDialog(id: string): void {
  this.id=id;
  this.getCategory(this.id);
}

getCategory(id){
  this.categoryService.get(id).subscribe(
    data => {           
      if(data[0]){
        let {
          id,
          name
        } = data[0];
        this.dialogRef = this.dialog.open(CategoryDialog, {
          width: '350px',
          data: {id, name}
        }); 
      }else{
        this.dialogRef = this.dialog.open(CategoryDialog, {
          width: '350px',
          data: {}
        });
      }
    },
    error => {
      this.snackBar.openSnackBar(error.error,'error');
});
}
 
  getCategories(){
    this.categoryService.getAll()
    .subscribe(
      data => {
        this.catlist = data;
        this.categories = this.catlist;
        this.sortedData = this.categories.slice();
        if(this.categories.length == 0){
          this.snackBar.openSnackBar('No categories for displaying','primary');  
        }
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }

  deleteCategory(category_id, arrayKey) {
    if(confirm("Are you sure that you want delete category")) {
      this.categoryService.deleteCategory({'id':category_id})
      .subscribe(
        data => {                     
          this.message = data;   
          if(this.message.message) this.snackBar.openSnackBar(this.message.message,'success');          
          delete this.sortedData[arrayKey]; 
        },
        error => {
          this.snackBar.openSnackBar(error.error,'error');
        });
    }
  }
  
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}



@Component({
  templateUrl: 'category.component.html',
})


export class CategoryDialog {

  constructor(
    public dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private snackBar:SnackbarService,
    private categoryService: CategoryService) { }


  onNoClick(): void { this.dialogRef.close(); }
  
  onSubmit(formCategory){
    this.categoryService.saveCategory(formCategory.value).subscribe(
      data => {
        this.dialogRef.close();
        window.location.reload(); 
      },
      error => {
        this.snackBar.openSnackBar(error,'error');
      });   
  }
}