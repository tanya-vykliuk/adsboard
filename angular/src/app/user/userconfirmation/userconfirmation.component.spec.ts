import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserconfirmationComponent } from './userconfirmation.component';

describe('UserconfirmationComponent', () => {
  let component: UserconfirmationComponent;
  let fixture: ComponentFixture<UserconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
