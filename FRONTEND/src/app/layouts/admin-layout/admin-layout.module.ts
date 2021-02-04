import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { MedicalReportComponent } from '../../pages/medical-report/medical-report.component';
import { StatisticsComponent } from '../../pages/statistics/statistics.component';
import { TrainingSessionsComponent } from '../../pages/training-sessions/training-sessions.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainingSessionDetailsComponent } from '../../pages/training-sessions/training-session-details/training-session-details.component';
import { TrainingSessionPlayComponent } from '../../pages/training-sessions/training-session-play/training-session-play.component';
// import { ToastrModule } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    MatSlideToggleModule,
  ],
  exports: [MatSlideToggleModule],
  declarations: [
    MedicalReportComponent,
    UserProfileComponent,
    TrainingSessionsComponent,
    StatisticsComponent,
    TrainingSessionDetailsComponent,
    TrainingSessionPlayComponent,
  ],
})
export class AdminLayoutModule {}
