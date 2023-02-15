import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { ClientAccountUpdateComponent } from 'app/entities/client-account/client-account-update.component';
import { ClientAccountService } from 'app/entities/client-account/client-account.service';
import { ClientAccount } from 'app/shared/model/client-account.model';

describe('Component Tests', () => {
  describe('ClientAccount Management Update Component', () => {
    let comp: ClientAccountUpdateComponent;
    let fixture: ComponentFixture<ClientAccountUpdateComponent>;
    let service: ClientAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [ClientAccountUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ClientAccountUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClientAccountUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ClientAccountService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ClientAccount(123);
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
        const entity = new ClientAccount();
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
