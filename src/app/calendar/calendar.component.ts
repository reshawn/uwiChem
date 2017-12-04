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
import {NotificationService} from '../notification.service';

import {GlobalsService} from '../globals.service';

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
  
  Statecode:String='';
  StateNumber:Number=0;
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
  newEventCourses: string[] = [];
  eventCourses: string[] = [];

  activeDayIsOpen: boolean = true;
  userID: String ;
  isAdmin: boolean = false;


  constructor(
    public loginservice : LoginService,
    private modal: NgbModal, 
    private db: AngularFireDatabase,
    private gs: GlobalsService,
    private ns: NotificationService,
  ) {
    this.userID = loginservice.userID;
    if (gs.AuthCode === 2) this.isAdmin = true;
   }

  ngOnInit() {
    this.setEvents('/Chemistry/users/'+this.userID+'/courseList');
    this.getAuthCode('/Chemistry/users/'+this.loginservice.userID).subscribe(Code => {
      this.Statecode=Code[0]
      if(this.Statecode=="Admin"){
        this.isAdmin=true;
        this.refresh.next();
        
      }

  })
}
  setEvents(listPath): void {
    this.db.object(listPath).valueChanges().subscribe((courses: String) =>{ //get object from observable
      this.courses = courses; //assign string of courses to var
      if (this.courses!=null)
        this.getEvents();
    });
  }
  getEvents():void {
    this.eventCourses = this.courses.split(" ");
    this.eventCourses.forEach(element => {
      var once = true;
      this.db.object('/Chemistry/courses/'+element+'/events').valueChanges().subscribe((e: Object) =>{
        if (e!=null){
          this.events = []; this.newEventCourses = [];
          var events: any = Object.values(e);
          events.forEach(event => {
            
            var ev:CalendarEvent= {
              title: element + ' : '+ event.title,
              start: parse(event.start),
              end: parse(event.end),
              color: {
                primary: event.colour,
                secondary: '#FAE3E3'
              },
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              }
            };
            this.events.push(ev);
            this.newEventCourses.push(element);
            this.ns.handleNotificationFromEvent(element,ev);
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
      },
    });
    if (this.eventCourses[0]!=null)
      this.newEventCourses.push(this.eventCourses[0]);
    else this.newEventCourses.push("");
    this.refresh.next();
  }
   getAuthCode(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }
  saveEvents():void {
    //Because the old events are retrieved and displayed, they should be currently in the array
    //and can be edited as well, therefore the old events in the live database can be removed
    //and this array can be added, reflecting the changes of the user
    
    
    var evs = [];

    this.eventCourses.forEach((c)=>{
      this.events.forEach((event,index) =>{
        if (c===this.newEventCourses[index]){
          var realTitle = event.title.split(" : ");
          var desc;
          if (realTitle.length===1)
            desc = event.title;
          else
            desc = realTitle.slice(1,realTitle.length).join(" : ");
          var e = {
            title:desc,
            start:event.start,
            colour:event.color.primary,
            end:event.end,
          };
          evs.push(e);
          // this.events.splice(index,1);
          // this.newEventCourses.splice(index,1);
          // this.refresh.next();
        }
      });
      var child = {
        events:evs
      };
      evs = [];
      this.events = []; this.newEventCourses = [];
      this.db.object('/Chemistry/courses/'+c+'/events').remove().then(_ =>{
        var once = true;
        if (once){
          once = false;
          
          this.db.object('/Chemistry/courses/'+c).update(child).then(_=>console.log("updated"));
        }
        
        
      }).catch(err => console.log(err, 'Failed to reset events'));
    })
  
  }

}
