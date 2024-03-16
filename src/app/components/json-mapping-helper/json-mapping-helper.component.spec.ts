import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonMappingHelperComponent } from './json-mapping-helper.component';

describe('JsonMappingHelperComponent', () => {
  let component: JsonMappingHelperComponent;
  let fixture: ComponentFixture<JsonMappingHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonMappingHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonMappingHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
