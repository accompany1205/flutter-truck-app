import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { DestinationDetailComponent } from 'app/entities/destination/destination-detail.component';
import { Destination } from 'app/shared/model/destination.model';

describe('Component Tests', () => {
  describe('Destination Management Detail Component', () => {
    let comp: DestinationDetailComponent;
    let fixture: ComponentFixture<DestinationDetailComponent>;
    const route = ({ data: of({ destination: new Destination(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [DestinationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DestinationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DestinationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load destination on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.destination).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
