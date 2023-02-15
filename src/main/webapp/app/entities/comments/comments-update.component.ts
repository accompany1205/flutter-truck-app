import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IComments, Comments } from 'app/shared/model/comments.model';
import { CommentsService } from './comments.service';
import { ITrip } from 'app/shared/model/trip.model';
import { TripService } from 'app/entities/trip/trip.service';
import { ITransporterAccount } from 'app/shared/model/transporter-account.model';
import { TransporterAccountService } from 'app/entities/transporter-account/transporter-account.service';

type SelectableEntity = ITrip | ITransporterAccount;

@Component({
  selector: 'jhi-comments-update',
  templateUrl: './comments-update.component.html'
})
export class CommentsUpdateComponent implements OnInit {
  isSaving = false;
  trips: ITrip[] = [];
  transporteraccounts: ITransporterAccount[] = [];

  editForm = this.fb.group({
    id: [],
    text: [null, [Validators.required]],
    date: [null, [Validators.required]],
    tripId: [],
    transporterAccountId: []
  });

  constructor(
    protected commentsService: CommentsService,
    protected tripService: TripService,
    protected transporterAccountService: TransporterAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      if (!comments.id) {
        const today = moment().startOf('day');
        comments.date = today;
      }

      this.updateForm(comments);

      this.tripService.query().subscribe((res: HttpResponse<ITrip[]>) => (this.trips = res.body || []));

      this.transporterAccountService
        .query()
        .subscribe((res: HttpResponse<ITransporterAccount[]>) => (this.transporteraccounts = res.body || []));
    });
  }

  updateForm(comments: IComments): void {
    this.editForm.patchValue({
      id: comments.id,
      text: comments.text,
      date: comments.date ? comments.date.format(DATE_TIME_FORMAT) : null,
      tripId: comments.tripId,
      transporterAccountId: comments.transporterAccountId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comments = this.createFromForm();
    if (comments.id !== undefined) {
      this.subscribeToSaveResponse(this.commentsService.update(comments));
    } else {
      this.subscribeToSaveResponse(this.commentsService.create(comments));
    }
  }

  private createFromForm(): IComments {
    return {
      ...new Comments(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      tripId: this.editForm.get(['tripId'])!.value,
      transporterAccountId: this.editForm.get(['transporterAccountId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComments>>): void {
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
