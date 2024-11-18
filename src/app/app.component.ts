import { Component } from '@angular/core';
import { ScheduleModule, RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';
import { RouterOutlet } from '@angular/router';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule, RouterOutlet, QuillModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StudyLink';
}
