import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILocation, Location } from 'app/shared/model/location.model';
import { LocationService } from './location.service';
import { IOrigin } from 'app/shared/model/origin.model';
import { OriginService } from 'app/entities/origin/origin.service';
import { IDestination } from 'app/shared/model/destination.model';
import { DestinationService } from 'app/entities/destination/destination.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country/country.service';

type SelectableEntity = IOrigin | IDestination | ICountry;

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html'
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;
  origins: IOrigin[] = [];
  destinations: IDestination[] = [];
  countries: ICountry[] = [];

  editForm = this.fb.group({
    id: [],
    streetAddress: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    originId: [],
    destinationId: [],
    countryId: []
  });

  constructor(
    protected locationService: LocationService,
    protected originService: OriginService,
    protected destinationService: DestinationService,
    protected countryService: CountryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);

      this.originService
        .query({ 'locationId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IOrigin[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IOrigin[]) => {
          if (!location.originId) {
            this.origins = resBody;
          } else {
            this.originService
              .find(location.originId)
              .pipe(
                map((subRes: HttpResponse<IOrigin>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IOrigin[]) => (this.origins = concatRes));
          }
        });

      this.destinationService
        .query({ 'locationId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IDestination[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IDestination[]) => {
          if (!location.destinationId) {
            this.destinations = resBody;
          } else {
            this.destinationService
              .find(location.destinationId)
              .pipe(
                map((subRes: HttpResponse<IDestination>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IDestination[]) => (this.destinations = concatRes));
          }
        });

      this.countryService
        .query({ 'locationId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<ICountry[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ICountry[]) => {
          if (!location.countryId) {
            this.countries = resBody;
          } else {
            this.countryService
              .find(location.countryId)
              .pipe(
                map((subRes: HttpResponse<ICountry>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ICountry[]) => (this.countries = concatRes));
          }
        });
    });
  }

  updateForm(location: ILocation): void {
    this.editForm.patchValue({
      id: location.id,
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      stateProvince: location.stateProvince,
      originId: location.originId,
      destinationId: location.destinationId,
      countryId: location.countryId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      streetAddress: this.editForm.get(['streetAddress'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      city: this.editForm.get(['city'])!.value,
      stateProvince: this.editForm.get(['stateProvince'])!.value,
      originId: this.editForm.get(['originId'])!.value,
      destinationId: this.editForm.get(['destinationId'])!.value,
      countryId: this.editForm.get(['countryId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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
