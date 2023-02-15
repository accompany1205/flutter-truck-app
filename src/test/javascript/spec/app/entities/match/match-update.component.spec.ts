import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { MatchUpdateComponent } from 'app/entities/match/match-update.component';
import { MatchService } from 'app/entities/match/match.service';
import { Match } from 'app/shared/model/match.model';

describe('Component Tests', () => {
  describe('Match Management Update Component', () => {
    let comp: MatchUpdateComponent;
    let fixture: ComponentFixture<MatchUpdateComponent>;
    let service: MatchService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [MatchUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(MatchUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MatchUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MatchService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Match(123);
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
        const entity = new Match();
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
