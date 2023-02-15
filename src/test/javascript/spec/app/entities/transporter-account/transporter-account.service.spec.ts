import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransporterAccountService } from 'app/entities/transporter-account/transporter-account.service';
import { ITransporterAccount, TransporterAccount } from 'app/shared/model/transporter-account.model';

describe('Service Tests', () => {
  describe('TransporterAccount Service', () => {
    let injector: TestBed;
    let service: TransporterAccountService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransporterAccount;
    let expectedResult: ITransporterAccount | ITransporterAccount[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(TransporterAccountService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new TransporterAccount(
        0,
        'AAAAAAA',
        'AAAAAAA',
        'image/png',
        'AAAAAAA',
        0,
        'image/png',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        false,
        'image/png',
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a TransporterAccount', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TransporterAccount()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TransporterAccount', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            phone: 'BBBBBB',
            patent: 'BBBBBB',
            balance: 1,
            insurance: 'BBBBBB',
            referal: 'BBBBBB',
            referedBy: 'BBBBBB',
            miniBio: 'BBBBBB',
            verifiedPhone: true,
            photo: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TransporterAccount', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            phone: 'BBBBBB',
            patent: 'BBBBBB',
            balance: 1,
            insurance: 'BBBBBB',
            referal: 'BBBBBB',
            referedBy: 'BBBBBB',
            miniBio: 'BBBBBB',
            verifiedPhone: true,
            photo: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a TransporterAccount', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
