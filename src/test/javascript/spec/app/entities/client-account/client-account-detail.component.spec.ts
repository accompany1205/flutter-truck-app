import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { LacusTestModule } from '../../../test.module';
import { ClientAccountDetailComponent } from 'app/entities/client-account/client-account-detail.component';
import { ClientAccount } from 'app/shared/model/client-account.model';

describe('Component Tests', () => {
  describe('ClientAccount Management Detail Component', () => {
    let comp: ClientAccountDetailComponent;
    let fixture: ComponentFixture<ClientAccountDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ clientAccount: new ClientAccount(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [ClientAccountDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ClientAccountDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ClientAccountDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load clientAccount on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.clientAccount).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeContentType, fakeBase64);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeContentType, fakeBase64);
      });
    });
  });
});
