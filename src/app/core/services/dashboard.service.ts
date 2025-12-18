import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { DashboardResponse } from "src/app/shared/models/dashboard.model";
import { DASHBOARD_2024_DATA } from "src/app/shared/constants/dashboard_2024.mock";
import { DASHBOARD_2025_DATA } from "src/app/shared/constants/dashboard_2025.mock";

@Injectable({ providedIn: 'root' })
export class DashboardService {

  getDashboardData(year: number): Observable<DashboardResponse> {
    if (year == 2024) {
      return of(DASHBOARD_2024_DATA);
    } else {
      return of(DASHBOARD_2025_DATA);
    }
  }
}
