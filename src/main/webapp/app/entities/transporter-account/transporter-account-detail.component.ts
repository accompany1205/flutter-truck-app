import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ITransporterAccount } from 'app/shared/model/transporter-account.model';

@Component({
  selector: 'jhi-transporter-account-detail',
  templateUrl: './transporter-account-detail.component.html'
})
export class TransporterAccountDetailComponent implements OnInit {
  transporterAccount: ITransporterAccount | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transporterAccount }) => (this.transporterAccount = transporterAccount));
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
