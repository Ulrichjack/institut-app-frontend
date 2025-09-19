import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFormationsComponent } from './home-formations.component';

describe('HomeFormationsComponent', () => {
  let component: HomeFormationsComponent;
  let fixture: ComponentFixture<HomeFormationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFormationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
