import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { CommentsDetailComponent } from 'app/entities/comments/comments-detail.component';
import { Comments } from 'app/shared/model/comments.model';

describe('Component Tests', () => {
  describe('Comments Management Detail Component', () => {
    let comp: CommentsDetailComponent;
    let fixture: ComponentFixture<CommentsDetailComponent>;
    const route = ({ data: of({ comments: new Comments(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [CommentsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CommentsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CommentsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load comments on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.comments).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
