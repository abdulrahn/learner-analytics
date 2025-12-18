import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Subscription } from 'rxjs';

import { ThemeService } from 'src/app/core/services/theme.service';
import { MessageService } from 'src/app/core/services/message.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DASHBOARD_2024_DATA } from 'src/app/shared/constants/dashboard_2024.mock';
import { PassStats } from 'src/app/shared/models/dashboard.model';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.scss']
})
export class PerformanceChartComponent implements OnInit, OnDestroy {
  barChartType: 'bar' = 'bar';
  performanceData: PassStats = {...DASHBOARD_2024_DATA.passStats};
  barChartData!: ChartConfiguration<'bar'>['data'];
  barChartOptions!: ChartConfiguration<'bar'>['options'];
  private sub = new Subscription();

  constructor(
    private themeService: ThemeService,
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) { }

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
      this.performanceData = { ...data.passStats };
      this.buildChart();
    });
  }

  private buildChart(): void {
    this.barChartData = {
      labels: Object.values(this.performanceData),
      datasets: [
        {
          label: 'Pass Percentage',
          data: [
            this.calc(this.performanceData.assessmentTaken, this.performanceData.overallLearners),
            this.calc(this.performanceData.passed, this.performanceData.assessmentTaken),
            this.calc(this.performanceData.passed, this.performanceData.assessmentTaken),
            this.calc(this.performanceData.failed, this.performanceData.assessmentTaken)
          ],
          backgroundColor: ['#60a5fa', '#22d3ee', '#34d399', '#f87171'],
          borderRadius: 8,
          barThickness: 18
        }
      ]
    };
  }

  private buildOptions(mode: 'light' | 'dark'): ChartConfiguration<'bar'>['options'] {
    const text = mode === 'dark' ? '#e5e7eb' : '#374151';
    const grid = mode === 'dark' ? '#374151' : '#e5e7eb';
    return {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
            color: text
          },
          grid: { color: grid },
          title: {
            display: true,
            text: 'Percentage',
            color: text
          }
        },
        y: {
          ticks: { color: text },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed?.x ?? 0;
              return `${value.toFixed(1)}%`;
            }
          }
        }

      }
    };
  }

  private calc(value: number, total: number): number {
    return total ? +(value / total * 100).toFixed(1) : 0;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
