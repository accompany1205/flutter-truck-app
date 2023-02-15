import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { CommentsUpdateComponent } from 'app/entities/comments/comments-update.component';
import { CommentsService } from 'app/entities/comments/comments.service';
import { Comments } from 'app/shared/model/comments.model';

describe('Component Tests', () => {
  describe('Comments Management Update Component', () => {
    let comp: CommentsUpdateComponent;
    let fixture: ComponentFixture<CommentsUpdateComponent>;
    let service: CommentsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [CommentsUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CommentsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CommentsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Comments(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Comments();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
