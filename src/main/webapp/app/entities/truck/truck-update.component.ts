import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ITruck, Truck } from 'app/shared/model/truck.model';
import { TruckService } from './truck.service';
import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from 'app/entities/driver/driver.service';
import { ITransporterAccount } from 'app/shared/model/transporter-account.model';
import { TransporterAccountService } from 'app/entities/transporter-account/transporter-account.service';

type SelectableEntity = IDriver | ITransporterAccount;

@Component({
  selector: 'jhi-truck-update',
  templateUrl: './truck-update.component.html'
})
export class TruckUpdateComponent implements OnInit {
  isSaving = false;
  drivers: IDriver[] = [];
  transporteraccounts: ITransporterAccount[] = [];

  editForm = this.fb.group({
    id: [],
    plateNumber: [null, [Validators.required]],
    conteneurPlateNumber: [],
    type: [],
    width: [],
    height: [],
    length: [],
    maxWeight: [],
    driverId: [],
    transporterAccountId: []
  });

  constructor(
    protected truckService: TruckService,
    protected driverService: DriverService,
    protected transporterAccountService: TransporterAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ truck }) => {
      this.updateForm(truck);

      this.driverService
        .query({ 'truckId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IDriver[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IDriver[]) => {
          if (!truck.driverId) {
            this.drivers = resBody;
          } else {
            this.driverService
              .find(truck.driverId)
              .pipe(
                map((subRes: HttpResponse<IDriver>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IDriver[]) => (this.drivers = concatRes));
          }
        });

      this.transporterAccountService
        .query()
        .subscribe((res: HttpResponse<ITransporterAccount[]>) => (this.transporteraccounts = res.body || []));
    });
  }

  updateForm(truck: ITruck): void {
    this.editForm.patchValue({
      id: truck.id,
      plateNumber: truck.plateNumber,
      conteneurPlateNumber: truck.conteneurPlateNumber,
      type: truck.type,
      width: truck.width,
      height: truck.height,
      length: truck.length,
      maxWeight: truck.maxWeight,
      driverId: truck.driverId,
      transporterAccountId: truck.transporterAccountId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const truck = this.createFromForm();
    if (truck.id !== undefined) {
      this.subscribeToSaveResponse(this.truckService.update(truck));
    } else {
      this.subscribeToSaveResponse(this.truckService.create(truck));
    }
  }

  private createFromForm(): ITruck {
    return {
      ...new Truck(),
      id: this.editForm.get(['id'])!.value,
      plateNumber: this.editForm.get(['plateNumber'])!.value,
      conteneurPlateNumber: this.editForm.get(['conteneurPlateNumber'])!.value,
      type: this.editForm.get(['type'])!.value,
      width: this.editForm.get(['width'])!.value,
      height: this.editForm.get(['height'])!.value,
      length: this.editForm.get(['length'])!.value,
      maxWeight: this.editForm.get(['maxWeight'])!.value,
      driverId: this.editForm.get(['driverId'])!.value,
      transporterAccountId: this.editForm.get(['transporterAccountId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITruck>>): void {
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
