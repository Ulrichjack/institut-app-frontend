import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryImageListAdminComponent } from './gallery-image-list-admin.component';

describe('GalleryImageListAdminComponent', () => {
  let component: GalleryImageListAdminComponent;
  let fixture: ComponentFixture<GalleryImageListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryImageListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryImageListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
