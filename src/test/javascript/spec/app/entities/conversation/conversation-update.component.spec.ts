import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LacusTestModule } from '../../../test.module';
import { ConversationUpdateComponent } from 'app/entities/conversation/conversation-update.component';
import { ConversationService } from 'app/entities/conversation/conversation.service';
import { Conversation } from 'app/shared/model/conversation.model';

describe('Component Tests', () => {
  describe('Conversation Management Update Component', () => {
    let comp: ConversationUpdateComponent;
    let fixture: ComponentFixture<ConversationUpdateComponent>;
    let service: ConversationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [LacusTestModule],
        declarations: [ConversationUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ConversationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConversationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ConversationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Conversation(123);
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
        const entity = new Conversation();
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
