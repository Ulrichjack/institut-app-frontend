import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenairesCarouselComponent } from './partenaires-carousel.component';

describe('PartenairesCarouselComponent', () => {
  let component: PartenairesCarouselComponent;
  let fixture: ComponentFixture<PartenairesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartenairesCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartenairesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
