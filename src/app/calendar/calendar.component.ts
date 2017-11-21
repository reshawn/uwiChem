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
  user: string = 'resh@gmail'; //to be obtained from authstate
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



  constructor(private modal: NgbModal, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.setEvents('/Chemistry/users/'+this.user);
  }
  setEvents(listPath): void {
    this.db.object(listPath).valueChanges().subscribe((coursesO: Object) =>{ //get object from observable
      var temp:any = Object.values(coursesO); //get values array from object
      this.courses = temp[0]; //assign string of courses to var
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
