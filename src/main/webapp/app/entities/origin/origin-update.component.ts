import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IOrigin, Origin } from 'app/shared/model/origin.model';
import { OriginService } from './origin.service';

@Component({
  selector: 'jhi-origin-update',
  templateUrl: './origin-update.component.html'
})
export class OriginUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: []
  });

  constructor(protected originService: OriginService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ origin }) => {
      this.updateForm(origin);
    });
  }

  updateForm(origin: IOrigin): void {
    this.editForm.patchValue({
      id: origin.id
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const origin = this.createFromForm();
    if (origin.id !== undefined) {
      this.subscribeToSaveResponse(this.originService.update(origin));
    } else {
      this.subscribeToSaveResponse(this.originService.create(origin));
    }
  }

  private createFromForm(): IOrigin {
    return {
      ...new Origin(),
      id: this.editForm.get(['id'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrigin>>): void {
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
