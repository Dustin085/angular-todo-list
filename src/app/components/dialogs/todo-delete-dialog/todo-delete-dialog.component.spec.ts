import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDeleteDialogComponent } from './todo-delete-dialog.component';

describe('TodoDeleteDialogComponent', () => {
  let component: TodoDeleteDialogComponent;
  let fixture: ComponentFixture<TodoDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDeleteDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
