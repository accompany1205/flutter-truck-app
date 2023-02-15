import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { OriginUpdateComponent } from 'app/entities/origin/origin-update.component';
import { OriginService } from 'app/entities/origin/origin.service';
import { Origin } from 'app/shared/model/origin.model';

describe('Component Tests', () => {
  describe('Origin Management Update Component', () => {
    let comp: OriginUpdateComponent;
    let fixture: ComponentFixture<OriginUpdateComponent>;
    let service: OriginService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [OriginUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OriginUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OriginUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OriginService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Origin(123);
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
        const entity = new Origin();
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
