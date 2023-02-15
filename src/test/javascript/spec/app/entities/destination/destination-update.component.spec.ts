import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { DestinationUpdateComponent } from 'app/entities/destination/destination-update.component';
import { DestinationService } from 'app/entities/destination/destination.service';
import { Destination } from 'app/shared/model/destination.model';

describe('Component Tests', () => {
  describe('Destination Management Update Component', () => {
    let comp: DestinationUpdateComponent;
    let fixture: ComponentFixture<DestinationUpdateComponent>;
    let service: DestinationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [DestinationUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DestinationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DestinationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DestinationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Destination(123);
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
        const entity = new Destination();
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
