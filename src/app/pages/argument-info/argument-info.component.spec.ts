import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentInfoComponent } from './argument-info.component';

describe('ArgumentInfoComponent', () => {
  let component: ArgumentInfoComponent;
  let fixture: ComponentFixture<ArgumentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgumentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArgumentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
