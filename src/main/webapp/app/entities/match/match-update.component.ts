import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMatch, Match } from 'app/shared/model/match.model';
import { MatchService } from './match.service';
import { IConversation } from 'app/shared/model/conversation.model';
import { ConversationService } from 'app/entities/conversation/conversation.service';
import { ITruck } from 'app/shared/model/truck.model';
import { TruckService } from 'app/entities/truck/truck.service';
import { ITrip } from 'app/shared/model/trip.model';
import { TripService } from 'app/entities/trip/trip.service';

type SelectableEntity = IConversation | ITruck | ITrip;

@Component({
  selector: 'jhi-match-update',
  templateUrl: './match-update.component.html'
})
export class MatchUpdateComponent implements OnInit {
  isSaving = false;
  conversations: IConversation[] = [];
  trucks: ITruck[] = [];
  trips: ITrip[] = [];

  editForm = this.fb.group({
    id: [],
    status: [null, [Validators.required]],
    date: [null, [Validators.required]],
    conversationId: [],
    truckId: [],
    tripId: []
  });

  constructor(
    protected matchService: MatchService,
    protected conversationService: ConversationService,
    protected truckService: TruckService,
    protected tripService: TripService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ match }) => {
      if (!match.id) {
        const today = moment().startOf('day');
        match.date = today;
      }

      this.updateForm(match);

      this.conversationService
        .query({ 'matchId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IConversation[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IConversation[]) => {
          if (!match.conversationId) {
            this.conversations = resBody;
          } else {
            this.conversationService
              .find(match.conversationId)
              .pipe(
                map((subRes: HttpResponse<IConversation>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IConversation[]) => (this.conversations = concatRes));
          }
        });

      this.truckService.query().subscribe((res: HttpResponse<ITruck[]>) => (this.trucks = res.body || []));

      this.tripService.query().subscribe((res: HttpResponse<ITrip[]>) => (this.trips = res.body || []));
    });
  }

  updateForm(match: IMatch): void {
    this.editForm.patchValue({
      id: match.id,
      status: match.status,
      date: match.date ? match.date.format(DATE_TIME_FORMAT) : null,
      conversationId: match.conversationId,
      truckId: match.truckId,
      tripId: match.tripId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const match = this.createFromForm();
    if (match.id !== undefined) {
      this.subscribeToSaveResponse(this.matchService.update(match));
    } else {
      this.subscribeToSaveResponse(this.matchService.create(match));
    }
  }

  private createFromForm(): IMatch {
    return {
      ...new Match(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      conversationId: this.editForm.get(['conversationId'])!.value,
      truckId: this.editForm.get(['truckId'])!.value,
      tripId: this.editForm.get(['tripId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatch>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
