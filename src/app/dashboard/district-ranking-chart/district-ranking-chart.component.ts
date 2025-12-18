import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { ThemeService } from 'src/app/core/services/theme.service';
import { BaseChartDirective } from 'ng2-charts';
import { DASHBOARD_2024_DATA } from 'src/app/shared/constants/dashboard_2024.mock';
import { MessageService } from 'src/app/core/services/message.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-district-ranking-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './district-ranking-chart.component.html',
  styleUrls: ['./district-ranking-chart.component.scss']
})
export class DistrictRankingChartComponent {
  districts = [...DASHBOARD_2024_DATA.districtRanking.districts];
  barChartType: 'bar' = 'bar';
  barChartData!: ChartData<'bar'>;
  barChartOptions!: ChartOptions<'bar'>;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService,
    private themeService: ThemeService
  ) {
    this.buildChart(); 
    this.messageService.getDate().subscribe(year => {
      this.loadDistrictRanking(year);
    });
  }

  private loadDistrictRanking(year: number): void {
    this.dashboardService.getDashboardData(year).subscribe(data => {
      this.districts = data.districtRanking.districts;
      this.buildChart(); 
    });
  }

  private buildChart(): void {
    this.barChartData = {
      labels: this.districts.map(d => d.district),
      datasets: [
        {
          label: 'Male',
          data: this.districts.map(d => d.male),
          backgroundColor: '#42a5f5'
        },
        {
          label: 'Female',
          data: this.districts.map(d => d.female),
          backgroundColor: '#ec407a'
        },
        {
          label: 'Others',
          data: this.districts.map(d => d.others),
          backgroundColor: '#b39ddb'
        },
        {
          label: 'Passed',
          data: this.districts.map(d => d.passed),
          backgroundColor: '#00c853'
        },
        {
          label: 'Assessment completed',
          yAxisID: 'y1',
          data: this.districts.map(d =>
            d.enrolled
              ? Math.round((d.assessmentCompleted / d.enrolled) * 100)
              : 0
          ),
          backgroundColor: '#ffb74d'
        }
      ]
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of users',
            color: this.textColor
          },
          ticks: { color: this.textColor },
          grid: { color: this.gridColor }
        },
        y1: {
          position: 'right',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Assessment completion %',
            color: this.textColor
          },
          ticks: {
            color: this.textColor,
            callback: value => `${value}%`
          },
          grid: { drawOnChartArea: false }
        },
        x: {
          ticks: { color: this.textColor },
          grid: { color: this.gridColor }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: this.textColor,
            usePointStyle: true,
            boxWidth: 10
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const value = ctx.parsed?.y ?? 0;
              if (ctx.dataset.label === 'Assessment completed') {
                return `Assessment completed: ${value}%`;
              }
              return `${ctx.dataset.label}: ${value.toLocaleString()}`;
            }
          }
        }
      }
    };
  }

  private get textColor() {
    return this.themeService.currentTheme() === 'dark'? '#ffffff': '#424242';
  }

  private get gridColor() {
    return this.themeService.currentTheme() === 'dark'? 'rgba(255,255,255,0.1)': 'rgba(0,0,0,0.05)';
  }
}
