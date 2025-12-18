import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SummaryCardsComponent } from './dashboard/summary-cards/summary-cards.component';
import { PerformanceChartComponent } from './dashboard/performance-chart/performance-chart.component';
import { ProgressChartsComponent } from './dashboard/progress-charts/progress-charts.component';
import { LearnerChartComponent } from './dashboard/learner-chart/learner-chart.component';
import { DistrictRankingChartComponent } from './dashboard/district-ranking-chart/district-ranking-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SummaryCardsComponent, ProgressChartsComponent, PerformanceChartComponent, LearnerChartComponent, DistrictRankingChartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Learner-Analysics';
}
