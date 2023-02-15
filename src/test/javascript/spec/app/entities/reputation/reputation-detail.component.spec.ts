import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { ReputationDetailComponent } from 'app/entities/reputation/reputation-detail.component';
import { Reputation } from 'app/shared/model/reputation.model';

describe('Component Tests', () => {
  describe('Reputation Management Detail Component', () => {
    let comp: ReputationDetailComponent;
    let fixture: ComponentFixture<ReputationDetailComponent>;
    const route = ({ data: of({ reputation: new Reputation(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [ReputationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ReputationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReputationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load reputation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.reputation).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
