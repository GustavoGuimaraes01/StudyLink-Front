import { Component } from '@angular/core';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';

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
