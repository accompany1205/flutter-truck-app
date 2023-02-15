import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { LacusTestModule } from '../../../test.module';
import { TransporterAccountDetailComponent } from 'app/entities/transporter-account/transporter-account-detail.component';
import { TransporterAccount } from 'app/shared/model/transporter-account.model';

describe('Component Tests', () => {
  describe('TransporterAccount Management Detail Component', () => {
    let comp: TransporterAccountDetailComponent;
    let fixture: ComponentFixture<TransporterAccountDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ transporterAccount: new TransporterAccount(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [TransporterAccountDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TransporterAccountDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TransporterAccountDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load transporterAccount on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.transporterAccount).toEqual(jasmine.objectContaining({ id: 123 }));
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
