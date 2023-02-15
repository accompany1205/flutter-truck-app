import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IReputation, Reputation } from 'app/shared/model/reputation.model';
import { ReputationService } from './reputation.service';
import { ITransporterAccount } from 'app/shared/model/transporter-account.model';
import { TransporterAccountService } from 'app/entities/transporter-account/transporter-account.service';
import { IClientAccount } from 'app/shared/model/client-account.model';
import { ClientAccountService } from 'app/entities/client-account/client-account.service';

type SelectableEntity = ITransporterAccount | IClientAccount;

@Component({
  selector: 'jhi-reputation-update',
  templateUrl: './reputation-update.component.html'
})
export class ReputationUpdateComponent implements OnInit {
  isSaving = false;
  transporteraccounts: ITransporterAccount[] = [];
  clientaccounts: IClientAccount[] = [];

  editForm = this.fb.group({
    id: [],
    rate: [null, [Validators.required]],
    goods: [null, [Validators.required]],
    punctuality: [null, [Validators.required]],
    communication: [null, [Validators.required]],
    comment: [],
    transporterAccountId: [],
    clientAccountId: []
  });

  constructor(
    protected reputationService: ReputationService,
    protected transporterAccountService: TransporterAccountService,
    protected clientAccountService: ClientAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reputation }) => {
      this.updateForm(reputation);

      this.transporterAccountService
        .query()
        .subscribe((res: HttpResponse<ITransporterAccount[]>) => (this.transporteraccounts = res.body || []));

      this.clientAccountService.query().subscribe((res: HttpResponse<IClientAccount[]>) => (this.clientaccounts = res.body || []));
    });
  }

  updateForm(reputation: IReputation): void {
    this.editForm.patchValue({
      id: reputation.id,
      rate: reputation.rate,
      goods: reputation.goods,
      punctuality: reputation.punctuality,
      communication: reputation.communication,
      comment: reputation.comment,
      transporterAccountId: reputation.transporterAccountId,
      clientAccountId: reputation.clientAccountId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reputation = this.createFromForm();
    if (reputation.id !== undefined) {
      this.subscribeToSaveResponse(this.reputationService.update(reputation));
    } else {
      this.subscribeToSaveResponse(this.reputationService.create(reputation));
    }
  }

  private createFromForm(): IReputation {
    return {
      ...new Reputation(),
      id: this.editForm.get(['id'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      goods: this.editForm.get(['goods'])!.value,
      punctuality: this.editForm.get(['punctuality'])!.value,
      communication: this.editForm.get(['communication'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      transporterAccountId: this.editForm.get(['transporterAccountId'])!.value,
      clientAccountId: this.editForm.get(['clientAccountId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReputation>>): void {
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
