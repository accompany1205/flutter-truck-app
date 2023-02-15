import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ITransporterAccount, TransporterAccount } from 'app/shared/model/transporter-account.model';
import { TransporterAccountService } from './transporter-account.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-transporter-account-update',
  templateUrl: './transporter-account-update.component.html'
})
export class TransporterAccountUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    patent: [null, [Validators.required]],
    patentContentType: [],
    balance: [],
    insurance: [],
    insuranceContentType: [],
    referal: [],
    referedBy: [],
    miniBio: [],
    verifiedPhone: [],
    photo: [],
    photoContentType: [],
    userId: [null, Validators.required]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected transporterAccountService: TransporterAccountService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transporterAccount }) => {
      this.updateForm(transporterAccount);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(transporterAccount: ITransporterAccount): void {
    this.editForm.patchValue({
      id: transporterAccount.id,
      name: transporterAccount.name,
      phone: transporterAccount.phone,
      patent: transporterAccount.patent,
      patentContentType: transporterAccount.patentContentType,
      balance: transporterAccount.balance,
      insurance: transporterAccount.insurance,
      insuranceContentType: transporterAccount.insuranceContentType,
      referal: transporterAccount.referal,
      referedBy: transporterAccount.referedBy,
      miniBio: transporterAccount.miniBio,
      verifiedPhone: transporterAccount.verifiedPhone,
      photo: transporterAccount.photo,
      photoContentType: transporterAccount.photoContentType,
      userId: transporterAccount.userId
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('lacusApp.error', { message: err.message })
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transporterAccount = this.createFromForm();
    if (transporterAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.transporterAccountService.update(transporterAccount));
    } else {
      this.subscribeToSaveResponse(this.transporterAccountService.create(transporterAccount));
    }
  }

  private createFromForm(): ITransporterAccount {
    return {
      ...new TransporterAccount(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      patentContentType: this.editForm.get(['patentContentType'])!.value,
      patent: this.editForm.get(['patent'])!.value,
      balance: this.editForm.get(['balance'])!.value,
      insuranceContentType: this.editForm.get(['insuranceContentType'])!.value,
      insurance: this.editForm.get(['insurance'])!.value,
      referal: this.editForm.get(['referal'])!.value,
      referedBy: this.editForm.get(['referedBy'])!.value,
      miniBio: this.editForm.get(['miniBio'])!.value,
      verifiedPhone: this.editForm.get(['verifiedPhone'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      userId: this.editForm.get(['userId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransporterAccount>>): void {
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

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
