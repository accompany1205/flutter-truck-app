import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { IdentityUpdateComponent } from 'app/entities/identity/identity-update.component';
import { IdentityService } from 'app/entities/identity/identity.service';
import { Identity } from 'app/shared/model/identity.model';

describe('Component Tests', () => {
  describe('Identity Management Update Component', () => {
    let comp: IdentityUpdateComponent;
    let fixture: ComponentFixture<IdentityUpdateComponent>;
    let service: IdentityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [IdentityUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(IdentityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IdentityUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(IdentityService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Identity(123);
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
        const entity = new Identity();
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
