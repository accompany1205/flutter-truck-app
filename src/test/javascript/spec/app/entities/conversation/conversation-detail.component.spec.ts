import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { ConversationDetailComponent } from 'app/entities/conversation/conversation-detail.component';
import { Conversation } from 'app/shared/model/conversation.model';

describe('Component Tests', () => {
  describe('Conversation Management Detail Component', () => {
    let comp: ConversationDetailComponent;
    let fixture: ComponentFixture<ConversationDetailComponent>;
    const route = ({ data: of({ conversation: new Conversation(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [ConversationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ConversationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConversationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load conversation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.conversation).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
