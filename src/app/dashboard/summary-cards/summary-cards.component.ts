import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Summary } from 'src/app/shared/models/dashboard.model';
import { DASHBOARD_2024_DATA } from 'src/app/shared/constants/dashboard_2024.mock';
import { MessageService } from 'src/app/core/services/message.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonToggleModule],
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss']
})
export class SummaryCardsComponent implements OnInit, OnDestroy {
  summary!: Summary;
  stats: Array<{
    label: string;
    value: string;
    icon: string;
    color: string;
  }> = [];
  private sub = new Subscription();

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.summary = { ...DASHBOARD_2024_DATA.summary };
    this.buildStats();

    this.sub.add(
      this.messageService.getDate().subscribe(year => {
        this.loadAnalytics(year);
      })
    );
  }

  private loadAnalytics(year: number): void {
    this.dashboardService.getDashboardData(year).subscribe(data => {
      this.summary = { ...data.summary };
      this.buildStats();
    });
  }

  private buildStats(): void {
    this.stats = [
      {
        label: 'Total Learners Enrolled',
        value: this.summary.totalLearners.toLocaleString(),
        icon: 'groups',
        color: '#4f8df7'
      },
      {
        label: 'Male',
        value: this.summary.male.toLocaleString(),
        icon: 'man',
        color: '#4fc3f7'
      },
      {
        label: 'Female',
        value: this.summary.female.toLocaleString(),
        icon: 'woman',
        color: '#ff5ca7'
      },
      {
        label: 'Others',
        value: this.summary.others.toLocaleString(),
        icon: 'transgender',
        color: '#c084fc'
      },
      {
        label: 'Active Learners',
        value: this.summary.activeLearners.toLocaleString(),
        icon: 'trending_up',
        color: '#22c55e'
      },
      {
        label: 'Engaged Learners',
        value: this.summary.engagedLearners.toLocaleString(),
        icon: 'insights',
        color: '#fb923c'
      }
    ];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
