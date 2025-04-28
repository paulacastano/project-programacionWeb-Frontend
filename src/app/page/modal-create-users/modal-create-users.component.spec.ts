import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateUsersComponent } from './modal-create-users.component';

describe('ModalCreateUsersComponent', () => {
  let component: ModalCreateUsersComponent;
  let fixture: ComponentFixture<ModalCreateUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
