import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit 
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  parse
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {LoginService} from '../login/login.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  
  view: string = 'month';
  courses: String;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  
  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = true;
  userID: String ;


  constructor(public loginservice : LoginService, private modal: NgbModal, private db: AngularFireDatabase) {
    this.userID = loginservice.userID;
   }

  ngOnInit() {
    this.setEvents('/Chemistry/users/'+this.userID+'/courseList');
  }
  setEvents(listPath): void {
    this.db.object(listPath).valueChanges().subscribe((courses: String) =>{ //get object from observable
      this.courses = courses; //assign string of courses to var
      console.log(this.courses);
      if (this.courses!=null)
      this.getEvents();
    });
  }
  getEvents():void {
    var courseA:string[] = this.courses.split(" ");
    courseA.forEach(element => {
      this.db.object('/Chemistry/courses/'+element+'/events').valueChanges().subscribe((e: Object) =>{
        if (e!=null){
          var events: any = Object.values(e);
          events.forEach(event => {
            this.events.push({title: element + ': '+ event.title,
            start: parse(event.start),
            end: parse(event.end),
            color: {
              primary: event.color,
              secondary: '#FAE3E3'
            },
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
          });
            this.refresh.next(); //trigger next for all observers to get new value (update calendar to new event)
            
          })
          
        }
      })
    });

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }


  

}
