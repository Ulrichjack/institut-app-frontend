import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationCreationComponent } from './formation-creation.component';

describe('FormationCreationComponent', () => {
  let component: FormationCreationComponent;
  let fixture: ComponentFixture<FormationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
