import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 

/* Angular material */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AdsListComponent } from './public/ads-list/ads-list.component';
import { DialogOverviewExampleDialog } from './public/ads-list/ads-list.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

import { Routes, RouterModule } from '@angular/router';
import { MyAdsListComponent } from './user/my-ads-list/my-ads-list.component';
import { MyAccountComponent } from './user/my-account/my-account.component';
import { AdPageComponent } from './user/ad-page/ad-page.component';
import { LoginComponent } from './public/login/login.component';
import { ManageAdsComponent, DialogReasonOverview } from './manager/manage-ads/manage-ads.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { AdvertisementComponent } from './public/advertisement/advertisement.component';
import { RegisterComponent } from './public/register/register.component';
import { UserconfirmationComponent } from './user/userconfirmation/userconfirmation.component';
import { CategoriesComponent, CategoryDialog } from './admin/categories/categories.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';

import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthGuard } from './auth.guard';
//import { DeactivateGuard } from './can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'advertisements', pathMatch: 'full' },
    { path: 'advertisements', component: AdsListComponent },
    { path: 'advertisements/:id', component: AdvertisementComponent },
    { path: 'login', component: LoginComponent },
    { path: 'confirmregistration/:token', component: UserconfirmationComponent },
    { path: 'registration', component: RegisterComponent },  
    
    { path: 'account', component: MyAccountComponent , canActivate: [AuthGuard]  },
    { path: 'my-ads-list', component: MyAdsListComponent , canActivate: [AuthGuard]},
    { path: 'ad-page', component: AdPageComponent  , canActivate: [AuthGuard]},
    { path: 'ad-page/:id', component: AdPageComponent  , canActivate: [AuthGuard]},  
  
    { path: 'manager/manage-ads', component: ManageAdsComponent , canActivate: [AuthGuard] },
  
    { path: 'admin/manage-users', component: ManageUsersComponent , canActivate: [AuthGuard]},
    { path: 'admin/manage-categories', component: CategoriesComponent , canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,    
    NavBarComponent,
    AdsListComponent,
    MyAdsListComponent,
    MyAccountComponent,
    AdPageComponent,
    LoginComponent,
    ManageAdsComponent,
    ManageUsersComponent,
    DialogOverviewExampleDialog,
    DialogReasonOverview,
    CategoryDialog,
    AdvertisementComponent,
    RegisterComponent,
    UserconfirmationComponent,
    CategoriesComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes),
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  

  providers: [AuthGuard, authInterceptorProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule ],
  entryComponents: [
    DialogOverviewExampleDialog,
    DialogReasonOverview,
    CategoryDialog    
  ]
})
export class AppModule { }
