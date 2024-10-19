import { Component } from '@angular/core';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1JpRGRGfV5ycEVAal5VTnJbUj0eQnxTdEFiWX5XcHJRT2VYV0VwXA==');

@Component({
  selector: 'app-agendador',
  standalone: true,
  imports: [ScheduleModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
  template: `<ejs-schedule></ejs-schedule>`,
  styleUrls: ['./agendador.component.css']
})
export class AgendadorComponent { 

}
