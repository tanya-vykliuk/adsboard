import { Component, OnInit, Inject } from '@angular/core';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TokenStorageService } from '../../services/token-storage.service';

//import { IDeactivateComponent } from '../../can-deactivate.guard';

@Component({
  selector: 'app-ad-page',
  templateUrl: './ad-page.component.html',
  styleUrls: ['./ad-page.component.less']
})
export class AdPageComponent  implements OnInit {
   advertisementForm: FormGroup;
  advertisement;
  categories;
  id;
  error;
  message;
  submitted;
  checked = false;
  backLink = '../../my-ads-list';

  constructor(private advertisementService: AdvertisementService, 
    private router:Router,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoryService:CategoryService,
    private snackBar:SnackbarService,
    private tokenStorage: TokenStorageService ) {}


// convenience getter for easy access to form fields
get f() { return this.advertisementForm.controls; }
  
ngOnInit() {
  this.id=this.route.snapshot.paramMap.get('id');
  this.categoryService.getAll().subscribe(
    data => {
      this.categories = data;
      if(parseInt(this.id) > 0){
        this.advertisementService.get(this.id).subscribe(
          data => {
            if(data){
              this.advertisement = data[0];
              this.advertisementForm.controls['title'].patchValue(this.advertisement.title);
              this.advertisementForm.controls['short_description'].patchValue(this.advertisement.short_description);
              this.advertisementForm.controls['description'].patchValue(this.advertisement.description);
              this.advertisementForm.controls['published'].patchValue(this.advertisement.published);    
              this.advertisementForm.controls['id'].patchValue(this.advertisement.id);    
              this.advertisementForm.controls['status'].patchValue(this.advertisement.status);       
              this.advertisementForm.controls['category_id'].patchValue(this.advertisement.category_id); 
              this.advertisementForm.controls['create_date'].patchValue(new Date(this.advertisement.create_date).toLocaleDateString()); 
              this.advertisementForm.controls['last_modify_date'].patchValue(new Date(this.advertisement.last_modify_date).toLocaleDateString()); 
            }
          },
          error => { 
            this.snackBar.openSnackBar(error.error,'error');
         });
      }      
    },
    error => { this.snackBar.openSnackBar(error.error,'error'); });
//****************************strip_tags( str )
    this.advertisementForm = this.formBuilder.group({
      title: new FormControl('',  
            [Validators.required, 
            Validators.maxLength(20)
          ]),      
      short_description: new FormControl('',  
          [Validators.required, 
          Validators.maxLength(75)
        ]),
      description: new FormControl('',  
          [Validators.required, 
          Validators.maxLength(500)
        ]),
        category_id: new FormControl('',  
          [Validators.required]),
        published: new FormControl(false),
        status: new FormControl('created'),
        create_date: new FormControl({disabled: true, value: new Date().toLocaleDateString()}),
        last_modify_date: new FormControl({disabled: true, value: new Date().toLocaleDateString()}),
        author_id: new FormControl({value: this.tokenStorage.getUser().id, readonly:true}),
        id: new FormControl()    
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.advertisementForm.invalid) { return;}

    return this.advertisementService.createAdvertisement(this.advertisementForm.value).subscribe(
      data => {  
        this.message = data;
        if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');}              
      },
      error => {
        this.snackBar.openSnackBar(error.error,'error');
      });
  }


/*  canExit() : boolean { 
    if (confirm("You have unsaved data, do you realy want to leave this page?")) {
        return true
      } else {
        return false
      }
    }*/
}