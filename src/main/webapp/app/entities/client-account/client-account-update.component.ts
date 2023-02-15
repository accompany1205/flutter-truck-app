import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IClientAccount, ClientAccount } from 'app/shared/model/client-account.model';
import { ClientAccountService } from './client-account.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IIdentity } from 'app/shared/model/identity.model';
import { IdentityService } from 'app/entities/identity/identity.service';

type SelectableEntity = IUser | IIdentity;

@Component({
  selector: 'jhi-client-account-update',
  templateUrl: './client-account-update.component.html'
})
export class ClientAccountUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];
  identities: IIdentity[] = [];

  editForm = this.fb.group({
    id: [],
    phone: [null, [Validators.required]],
    referal: [],
    referedBy: [],
    miniBio: [],
    verifiedPhone: [],
    photo: [],
    photoContentType: [],
    userId: [null, Validators.required],
    identityId: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected clientAccountService: ClientAccountService,
    protected userService: UserService,
    protected identityService: IdentityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientAccount }) => {
      this.updateForm(clientAccount);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));

      this.identityService
        .query({ 'clientAccountId.specified': 'false' })
        .pipe(
          map((res: HttpResponse<IIdentity[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IIdentity[]) => {
          if (!clientAccount.identityId) {
            this.identities = resBody;
          } else {
            this.identityService
              .find(clientAccount.identityId)
              .pipe(
                map((subRes: HttpResponse<IIdentity>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IIdentity[]) => (this.identities = concatRes));
          }
        });
    });
  }

  updateForm(clientAccount: IClientAccount): void {
    this.editForm.patchValue({
      id: clientAccount.id,
      phone: clientAccount.phone,
      referal: clientAccount.referal,
      referedBy: clientAccount.referedBy,
      miniBio: clientAccount.miniBio,
      verifiedPhone: clientAccount.verifiedPhone,
      photo: clientAccount.photo,
      photoContentType: clientAccount.photoContentType,
      userId: clientAccount.userId,
      identityId: clientAccount.identityId
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
    const clientAccount = this.createFromForm();
    if (clientAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.clientAccountService.update(clientAccount));
    } else {
      this.subscribeToSaveResponse(this.clientAccountService.create(clientAccount));
    }
  }

  private createFromForm(): IClientAccount {
    return {
      ...new ClientAccount(),
      id: this.editForm.get(['id'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      referal: this.editForm.get(['referal'])!.value,
      referedBy: this.editForm.get(['referedBy'])!.value,
      miniBio: this.editForm.get(['miniBio'])!.value,
      verifiedPhone: this.editForm.get(['verifiedPhone'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      identityId: this.editForm.get(['identityId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientAccount>>): void {
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
