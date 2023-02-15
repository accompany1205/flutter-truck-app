import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ITrip, Trip } from 'app/shared/model/trip.model';
import { TripService } from './trip.service';
import { IOrigin } from 'app/shared/model/origin.model';
import { OriginService } from 'app/entities/origin/origin.service';
import { IDestination } from 'app/shared/model/destination.model';
import { DestinationService } from 'app/entities/destination/destination.service';
import { IClientAccount } from 'app/shared/model/client-account.model';
import { ClientAccountService } from 'app/entities/client-account/client-account.service';

type SelectableEntity = IOrigin | IDestination | IClientAccount;

@Component({
  selector: 'jhi-trip-update',
  templateUrl: './trip-update.component.html'
})
export class TripUpdateComponent implements OnInit {
  isSaving = false;
  origins: IOrigin[] = [];
  destinations: IDestination[] = [];
  clientaccounts: IClientAccount[] = [];

  editForm = this.fb.group({
    id: [],
    isFull: [null, [Validators.required]],
    width: [],
    height: [],
    length: [],
    weight: [],
    marchandise: [null, [Validators.required]],
    etd: [null, [Validators.required]],
    description: [],
    state: [],
    eta: [],
    distance: [null, [Validators.required]],
    originId: [],
    destinationId: [],
    clientAccountId: []
  });

  constructor(
    protected tripService: TripService,
    protected originService: OriginService,
    protected destinationService: DestinationService,
    protected clientAccountService: ClientAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trip }) => {
      if (!trip.id) {
        const today = moment().startOf('day');
        trip.etd = today;
        trip.eta = today;
      }

      this.updateForm(trip);

      this.originService
        .query({ 'tripId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IOrigin[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IOrigin[]) => {
          if (!trip.originId) {
            this.origins = resBody;
          } else {
            this.originService
              .find(trip.originId)
              .pipe(
                map((subRes: HttpResponse<IOrigin>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IOrigin[]) => (this.origins = concatRes));
          }
        });

      this.destinationService
        .query({ 'tripId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IDestination[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IDestination[]) => {
          if (!trip.destinationId) {
            this.destinations = resBody;
          } else {
            this.destinationService
              .find(trip.destinationId)
              .pipe(
                map((subRes: HttpResponse<IDestination>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IDestination[]) => (this.destinations = concatRes));
          }
        });

      this.clientAccountService.query().subscribe((res: HttpResponse<IClientAccount[]>) => (this.clientaccounts = res.body || []));
    });
  }

  updateForm(trip: ITrip): void {
    this.editForm.patchValue({
      id: trip.id,
      isFull: trip.isFull,
      width: trip.width,
      height: trip.height,
      length: trip.length,
      weight: trip.weight,
      marchandise: trip.marchandise,
      etd: trip.etd ? trip.etd.format(DATE_TIME_FORMAT) : null,
      description: trip.description,
      state: trip.state,
      eta: trip.eta ? trip.eta.format(DATE_TIME_FORMAT) : null,
      distance: trip.distance,
      originId: trip.originId,
      destinationId: trip.destinationId,
      clientAccountId: trip.clientAccountId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trip = this.createFromForm();
    if (trip.id !== undefined) {
      this.subscribeToSaveResponse(this.tripService.update(trip));
    } else {
      this.subscribeToSaveResponse(this.tripService.create(trip));
    }
  }

  private createFromForm(): ITrip {
    return {
      ...new Trip(),
      id: this.editForm.get(['id'])!.value,
      isFull: this.editForm.get(['isFull'])!.value,
      width: this.editForm.get(['width'])!.value,
      height: this.editForm.get(['height'])!.value,
      length: this.editForm.get(['length'])!.value,
      weight: this.editForm.get(['weight'])!.value,
      marchandise: this.editForm.get(['marchandise'])!.value,
      etd: this.editForm.get(['etd'])!.value ? moment(this.editForm.get(['etd'])!.value, DATE_TIME_FORMAT) : undefined,
      description: this.editForm.get(['description'])!.value,
      state: this.editForm.get(['state'])!.value,
      eta: this.editForm.get(['eta'])!.value ? moment(this.editForm.get(['eta'])!.value, DATE_TIME_FORMAT) : undefined,
      distance: this.editForm.get(['distance'])!.value,
      originId: this.editForm.get(['originId'])!.value,
      destinationId: this.editForm.get(['destinationId'])!.value,
      clientAccountId: this.editForm.get(['clientAccountId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrip>>): void {
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
