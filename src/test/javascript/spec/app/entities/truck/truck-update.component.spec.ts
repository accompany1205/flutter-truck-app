import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { TruckUpdateComponent } from 'app/entities/truck/truck-update.component';
import { TruckService } from 'app/entities/truck/truck.service';
import { Truck } from 'app/shared/model/truck.model';

describe('Component Tests', () => {
  describe('Truck Management Update Component', () => {
    let comp: TruckUpdateComponent;
    let fixture: ComponentFixture<TruckUpdateComponent>;
    let service: TruckService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [TruckUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TruckUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TruckUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TruckService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Truck(123);
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
        const entity = new Truck();
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
