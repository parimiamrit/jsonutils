import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonescapeComponent } from './jsonescape.component';

describe('JsonescapeComponent', () => {
  let component: JsonescapeComponent;
  let fixture: ComponentFixture<JsonescapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonescapeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonescapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
