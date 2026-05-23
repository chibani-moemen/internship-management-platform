import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, switchMap, shareReplay } from 'rxjs';

import { RequestService } from '../../services/request';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-requests.html',
  styleUrls: ['./admin-requests.css']
})
export class AdminRequestsComponent {

  message = '';
  error = '';

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(private requestService: RequestService) {}

  requests$ = this.refresh$.pipe(
    switchMap(() => this.requestService.getByStatus('COMPANY_ACCEPTED')),
    shareReplay(1)
  );

  reload() {
    this.message = '';
    this.error = '';
    this.refresh$.next();
  }

  approve(id: number) {
    this.message = '';
    this.error = '';

    this.requestService.isetApprove(id).subscribe({
      next: () => {
        this.message = 'Request approved by ISET ✅';
        this.reload();
      },
      error: () => {
        this.error = 'Approve failed ❌';
      }
    });
  }

  reject(id: number) {
    this.message = '';
    this.error = '';

    this.requestService.isetReject(id).subscribe({
      next: () => {
        this.message = 'Request rejected by ISET ✅';
        this.reload();
      },
      error: () => {
        this.error = 'Reject failed ❌';
      }
    });
  }
}