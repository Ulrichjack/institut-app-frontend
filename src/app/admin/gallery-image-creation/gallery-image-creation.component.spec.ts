import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryImageCreationComponent } from './gallery-image-creation.component';

describe('GalleryImageCreationComponent', () => {
  let component: GalleryImageCreationComponent;
  let fixture: ComponentFixture<GalleryImageCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryImageCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryImageCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
