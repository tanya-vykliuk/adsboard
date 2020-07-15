import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdsListComponent } from './my-ads-list.component';

describe('MyAdsListComponent', () => {
  let component: MyAdsListComponent;
  let fixture: ComponentFixture<MyAdsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAdsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
