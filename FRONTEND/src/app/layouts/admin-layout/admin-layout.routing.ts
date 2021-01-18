import { Routes } from '@angular/router';

import { MedicalReportComponent } from '../../pages/medical-report/medical-report.component';
import { TrainingSessionsComponent } from '../../pages/training-sessions/training-sessions.component';
import { StatisticsComponent } from '../../pages/statistics/statistics.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TrainingSessionDetailsComponent } from '../../pages/training-sessions/training-session-details/training-session-details.component';
import { TrainingSessionPlayComponent } from '../../pages/training-sessions/training-session-play/training-session-play.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'medical-report', component: MedicalReportComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'training-sessions', component: TrainingSessionsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'training-session-details', component: TrainingSessionDetailsComponent },
  { path: 'training-session-play', component: TrainingSessionPlayComponent}
];
