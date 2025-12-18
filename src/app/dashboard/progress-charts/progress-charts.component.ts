import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { ThemeService } from 'src/app/core/services/theme.service';
import { MessageService } from 'src/app/core/services/message.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DASHBOARD_2024_DATA } from 'src/app/shared/constants/dashboard_2024.mock';
import { CourseProgress } from 'src/app/shared/models/dashboard.model';

@Component({
  selector: 'app-progress-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './progress-charts.component.html',
  styleUrls: ['./progress-charts.component.scss']
})
export class ProgressChartsComponent implements OnInit, OnDestroy {
  barChartType: 'bar' = 'bar';
  courseProgressData: CourseProgress[] = [...DASHBOARD_2024_DATA.courseProgress];
  barChartData!: ChartConfiguration<'bar'>['data'];
  barChartOptions!: ChartConfiguration<'bar'>['options'];
  private sub = new Subscription();
  constructor(
    private themeService: ThemeService,
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.buildChart();

    this.sub.add(
      this.themeService.themeChanges().subscribe(mode => {
        this.barChartOptions = this.buildOptions(mode);
      })
    );

    this.sub.add(
      this.messageService.getDate().subscribe(year => {
        this.loadAnalytics(year);
      })
    );
  }

  private loadAnalytics(year: number): void {
    this.dashboardService.getDashboardData(year).subscribe(data => {
      this.courseProgressData = [...data.courseProgress];
      this.buildChart();
    });
  }

  private buildChart(): void {
    this.barChartData = {
      labels: this.courseProgressData.map(item => item.district),
      datasets: [
        {
          label: 'Below',
          data: this.courseProgressData.map(item => item.below),
          backgroundColor: '#f87171',
          borderRadius: 6,
          barThickness: 14
        },
        {
          label: 'Average',
          data: this.courseProgressData.map(item => item.average),
          backgroundColor: '#34d399',
          borderRadius: 6,
          barThickness: 14
        },
        {
          label: 'Good',
          data: this.courseProgressData.map(item => item.good),
          backgroundColor: '#60a5fa',
          borderRadius: 6,
          barThickness: 14
        }
      ]
    };
  }

  private buildOptions(mode: 'light' | 'dark'): ChartConfiguration<'bar'>['options'] {
    const text = mode === 'dark' ? '#e5e7eb' : '#374151';
    const grid = mode === 'dark' ? '#374151' : '#e5e7eb';
    return {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'District',
            color: text
          },
          ticks: { color: text },
          grid: { display: false }
        },
        y: {
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Course Progress (%)',
            color: text
          },
          ticks: {
            color: text,
            callback: value => `${value}%`
          },
          grid: { color: grid }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: text }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const value = ctx.parsed?.y ?? 0;
              return `${ctx.dataset.label}: ${value}%`;
            }
          }
        }
      }
    };
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
