import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IDestination, Destination } from 'app/shared/model/destination.model';
import { DestinationService } from './destination.service';

@Component({
  selector: 'jhi-destination-update',
  templateUrl: './destination-update.component.html'
})
export class DestinationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: []
  });

  constructor(protected destinationService: DestinationService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ destination }) => {
      this.updateForm(destination);
    });
  }

  updateForm(destination: IDestination): void {
    this.editForm.patchValue({
      id: destination.id
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const destination = this.createFromForm();
    if (destination.id !== undefined) {
      this.subscribeToSaveResponse(this.destinationService.update(destination));
    } else {
      this.subscribeToSaveResponse(this.destinationService.create(destination));
    }
  }

  private createFromForm(): IDestination {
    return {
      ...new Destination(),
      id: this.editForm.get(['id'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDestination>>): void {
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
