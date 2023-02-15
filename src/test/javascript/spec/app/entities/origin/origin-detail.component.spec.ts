import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { OriginDetailComponent } from 'app/entities/origin/origin-detail.component';
import { Origin } from 'app/shared/model/origin.model';

describe('Component Tests', () => {
  describe('Origin Management Detail Component', () => {
    let comp: OriginDetailComponent;
    let fixture: ComponentFixture<OriginDetailComponent>;
    const route = ({ data: of({ origin: new Origin(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [OriginDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OriginDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OriginDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load origin on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.origin).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
