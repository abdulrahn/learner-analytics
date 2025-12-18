import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MessageService } from 'src/app/core/services/message.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatToolbarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isDarkMode = false;
  districts: string[] = [];
  selectedDistrict = 'All Districts';
  dateFilter = [
    { key: 2024, value: '01 Jan, 2024 - 31 Dec, 2024' },
    { key: 2025, value: '01 Jan, 2025 - 31 Dec, 2025' }
  ];
  selectedDateRange = this.dateFilter[0].value;
  selectedDateKey = this.dateFilter[0].key;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.messageService.setDate(this.selectedDateKey);
    this.loadDistricts(this.selectedDateKey);
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    this.messageService.getDate().subscribe(year => {
      this.selectedDateKey = year;
      const selectedDateObj = this.dateFilter.find(d => d.key === year);
      if (selectedDateObj) {
        this.selectedDateRange = selectedDateObj.value;
      }
      this.loadDistricts(year);
    });
  }

  onDateChange(selectedValue: string): void {
    const selected = this.dateFilter.find(d => d.value === selectedValue);
    if (selected) {
      this.selectedDateKey = selected.key;
      this.messageService.setDate(this.selectedDateKey);
    }
  }

  private loadDistricts(year: number): void {
    this.dashboardService.getDashboardData(year).subscribe(data => {
      const uniqueDistricts = new Set(
        data.courseProgress.map(item => item.district)
      );
      this.districts = ['All Districts', ...Array.from(uniqueDistricts)];
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    const theme = this.isDarkMode ? 'dark-theme' : 'light-theme';
    body.classList.add(theme);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
