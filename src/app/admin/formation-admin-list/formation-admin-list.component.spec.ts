import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationAdminListComponent } from './formation-admin-list.component';

describe('FormationAdminListComponent', () => {
  let component: FormationAdminListComponent;
  let fixture: ComponentFixture<FormationAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationAdminListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
