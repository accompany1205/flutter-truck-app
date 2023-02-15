import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { TransporterAccountUpdateComponent } from 'app/entities/transporter-account/transporter-account-update.component';
import { TransporterAccountService } from 'app/entities/transporter-account/transporter-account.service';
import { TransporterAccount } from 'app/shared/model/transporter-account.model';

describe('Component Tests', () => {
  describe('TransporterAccount Management Update Component', () => {
    let comp: TransporterAccountUpdateComponent;
    let fixture: ComponentFixture<TransporterAccountUpdateComponent>;
    let service: TransporterAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [TransporterAccountUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TransporterAccountUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransporterAccountUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TransporterAccountService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new TransporterAccount(123);
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
        const entity = new TransporterAccount();
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
