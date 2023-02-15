import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IIdentity, Identity } from 'app/shared/model/identity.model';
import { IdentityService } from './identity.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-identity-update',
  templateUrl: './identity-update.component.html'
})
export class IdentityUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    identity: [],
    identityContentType: [],
    type: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected identityService: IdentityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ identity }) => {
      this.updateForm(identity);
    });
  }

  updateForm(identity: IIdentity): void {
    this.editForm.patchValue({
      id: identity.id,
      identity: identity.identity,
      identityContentType: identity.identityContentType,
      type: identity.type
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
    const identity = this.createFromForm();
    if (identity.id !== undefined) {
      this.subscribeToSaveResponse(this.identityService.update(identity));
    } else {
      this.subscribeToSaveResponse(this.identityService.create(identity));
    }
  }

  private createFromForm(): IIdentity {
    return {
      ...new Identity(),
      id: this.editForm.get(['id'])!.value,
      identityContentType: this.editForm.get(['identityContentType'])!.value,
      identity: this.editForm.get(['identity'])!.value,
      type: this.editForm.get(['type'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdentity>>): void {
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
}
