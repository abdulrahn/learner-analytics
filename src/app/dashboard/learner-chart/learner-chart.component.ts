import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

import { ThemeService } from 'src/app/core/services/theme.service';
import { MessageService } from 'src/app/core/services/message.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DASHBOARD_2024_DATA } from 'src/app/shared/constants/dashboard_2024.mock';
import { AssessmentCompletion, GradeBreakdown } from 'src/app/shared/models/dashboard.model';

@Component({
  selector: 'app-learner-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './learner-chart.component.html',
  styleUrls: ['./learner-chart.component.scss']
})
export class LearnerChartComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private sub = new Subscription();
  donutChartType: 'doughnut' = 'doughnut';
  pieChartType: 'pie' = 'pie';
  assessmentCompletionRate: AssessmentCompletion = {
    ...DASHBOARD_2024_DATA.assessmentCompletion
  };
  gradeDistribution: GradeBreakdown[] = [
    ...DASHBOARD_2024_DATA.gradeBreakdown
  ];
  donutChartData!: ChartData<'doughnut'>;
  pieChartData!: ChartData<'pie'>;
  donutChartOptions!: ChartOptions<'doughnut'>;
  pieChartOptions!: ChartOptions<'pie'>;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.buildCharts();
    this.sub.add(
      this.messageService.getDate().subscribe(year => {
        this.loadAnalytics(year);
      })
    );
    this.sub.add(
      this.themeService.themeChanges().subscribe(() => {
        this.buildChartOptions();
      })
    );
  }

  private loadAnalytics(year: number): void {
    this.dashboardService.getDashboardData(year).subscribe(data => {
      this.assessmentCompletionRate = { ...data.assessmentCompletion };
      this.gradeDistribution = [...data.gradeBreakdown];
      this.buildCharts();
    });
  }

  private buildCharts(): void {
    this.buildDonutChart();
    this.buildPieChart();
    this.buildChartOptions();
  }

  private buildDonutChart(): void {
    this.donutChartData = {
      labels: [
        `Assessment completed ${this.assessmentCompletionRate.completedPercent}%`,
        `Assessment not completed ${this.assessmentCompletionRate.notCompletedPercent}%`
      ],
      datasets: [
        {
          data: [
            this.assessmentCompletionRate.completedPercent,
            this.assessmentCompletionRate.notCompletedPercent
          ],
          backgroundColor: ['#42a5f5', '#ffab91'],
          borderWidth: 0
        }
      ]
    };
  }

  private buildPieChart(): void {
    this.pieChartData = {
      labels: this.gradeDistribution.map(g => g.label),
      datasets: [
        {
          data: this.gradeDistribution.map(g => g.percent),
          backgroundColor: [
            '#64b5f6',
            '#00c49f',
            '#ffb74d',
            '#ff6f61',
            '#e3f2fd'
          ],
          borderWidth: 0
        }
      ]
    };
  }

  private buildChartOptions(): void {
    const textColor = this.getTextColor();
    this.donutChartOptions = {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: textColor }
        }
      }
    };
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: textColor }
        }
      }
    };
  }

  private getTextColor(): string {
    return this.themeService.currentTheme() === 'dark'? '#e5e7eb': '#374151';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
