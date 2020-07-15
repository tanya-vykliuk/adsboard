import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarRef
} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class SnackbarService {
  snackBarConfig: MatSnackBarConfig;
  snackBarRef: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarAutoHide = '5000';
  private renderer: Renderer2;

  constructor(private snackBar: MatSnackBar, private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  openSnackBar(message, type) {
    //let panelClass = 'alert-primary';

    this.snackBarConfig = new MatSnackBarConfig();

    let panelClass = 'alert-'+type;
    switch(type){
      case 'success': 
                  panelClass = 'alert-'+type; this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0); break;
      case 'error':
      case 'danger': 
                  panelClass = 'alert-danger';
                  setTimeout(()=>{
                    let snackEl = document.getElementsByClassName('mat-snack-bar-container').item(0);
                    this.renderer.listen(snackEl, 'click', ()=>this.dismiss())
                  });
                  break;
      default : panelClass = 'alert-primary';
                this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0); 
    }
      
      this.snackBarConfig.horizontalPosition = this.horizontalPosition;
      this.snackBarConfig.verticalPosition = this.verticalPosition;    
      this.snackBarConfig.panelClass = panelClass;
      this.snackBarRef = this.snackBar.open(message, '', this.snackBarConfig);
  }

  dismiss(){
    this.snackBarRef.dismiss();
  }
}
