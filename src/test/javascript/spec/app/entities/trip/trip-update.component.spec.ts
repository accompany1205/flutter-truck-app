import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { TripUpdateComponent } from 'app/entities/trip/trip-update.component';
import { TripService } from 'app/entities/trip/trip.service';
import { Trip } from 'app/shared/model/trip.model';

describe('Component Tests', () => {
  describe('Trip Management Update Component', () => {
    let comp: TripUpdateComponent;
    let fixture: ComponentFixture<TripUpdateComponent>;
    let service: TripService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [TripUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TripUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TripUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TripService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Trip(123);
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
        const entity = new Trip();
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
