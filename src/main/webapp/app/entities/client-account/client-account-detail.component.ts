import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IClientAccount } from 'app/shared/model/client-account.model';

@Component({
  selector: 'jhi-client-account-detail',
  templateUrl: './client-account-detail.component.html'
})
export class ClientAccountDetailComponent implements OnInit {
  clientAccount: IClientAccount | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientAccount }) => (this.clientAccount = clientAccount));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
