import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Json2classComponent } from './json2class.component';

describe('Json2classComponent', () => {
  let component: Json2classComponent;
  let fixture: ComponentFixture<Json2classComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Json2classComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Json2classComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
