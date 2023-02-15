import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { ReputationUpdateComponent } from 'app/entities/reputation/reputation-update.component';
import { ReputationService } from 'app/entities/reputation/reputation.service';
import { Reputation } from 'app/shared/model/reputation.model';

describe('Component Tests', () => {
  describe('Reputation Management Update Component', () => {
    let comp: ReputationUpdateComponent;
    let fixture: ComponentFixture<ReputationUpdateComponent>;
    let service: ReputationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [ReputationUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ReputationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReputationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ReputationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Reputation(123);
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
        const entity = new Reputation();
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
