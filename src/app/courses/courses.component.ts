import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AngularFireDatabase , AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../login/login.service';
import {MatButtonModule} from '@angular/material/button';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  
  coursesObservable: Observable<any[]>;
  userList: Observable<any[]>;
  userObject: AngularFireObject<any>;
  coursesObject: AngularFireObject<any>;
  listCourses: Object[] = [];
  listAllCourses: Object[] = [];
  user_ID : string;
  user_courses: string [];
  user_courseNames: string[] = [];
  isSelected:  boolean = false;
  selectedCourse: Observable<any>;
  sub: any;
  courseArray: Object[] = [];
  newCourseList: Observable<any[]>;
  

  constructor(private db: AngularFireDatabase, private lgnService: LoginService,private modalService: NgbModal) { }

   

  ngOnInit() {
    this.coursesObservable = this.getCourses('/Chemistry/courses');
    
    console.log(this.coursesObservable);
    this.userList = this.getCourses('/Chemistry/users');
     this.user_ID = this.lgnService.userID;
     console.log("USERID =" + this.user_ID);
     this.db.object('Chemistry/users/' + this.user_ID).valueChanges().subscribe(user => {
       if( user != null )
       {
           this.userObject = this.db.object('Chemistry/users/' + this.user_ID);
           var actualUser : any = Object.values(user);
           //console.log("THIS-> " + actualUser);
           this.user_courses = actualUser[1].split(" ");
           console.log("loodydoo",this.user_courses[0]);
           this.coursesObservable.subscribe(allCourse => {
             console.log(allCourse[1]);
             this.courseArray = allCourse;
             console.log(this.courseArray);
             let w = 0;
             let g = 0;
             for(w=0;w<this.user_courses.length;w++)
             {
               for(g=0;g<allCourse.length;g++)
               {
                 if(this.user_courses[w] === allCourse[g].courseCode)
                 {
                  console.log(allCourse[g]);
                  allCourse.splice(g,1);
                  //console.log(allCourse);
                   
                 }
                 //console.log(this.user_courses[w], allCourse[g]);
               }
             }
             this.courseArray = allCourse;
             console.log(this.courseArray);
           //  console.log("below");
           //  console.log(allCourse);
             
           })
           
           //console.log("Array Holding courses: " + this.user_courses); //USER COURSE CODES
           //console.log("Array Length: " + this.user_courses.length);
           //console.log("Course1: " + this.user_courses[0]);
           //console.log("Course2: " + this.user_courses[1]);
           var actualCourse: any; 
           let x = 0;
           let y=0;
           for(x=0;x<this.user_courses.length;x++)
           {
            //console.log(x);
             this.db.object('Chemistry/courses/' + this.user_courses[x]).valueChanges().subscribe(course => {
             if(course !=null){
                this.listCourses.push(course);
                console.log("lc below");
                console.log(this.listCourses);
                //console.log(this.listCourses);
                //console.log(x);
                actualCourse = Object.values(course);
                //console.log(actualCourse);
                //console.log("LeeroyJenkins: " + actualCourse);
                this.user_courseNames[y] = actualCourse[2];
                y++;
               // console.log("This user's courses: " + this.user_courseNames);//USER COURSE NAMES
                
                
             }
             //console.log()
             })

             
             /*
             this.coursesObject = this.db.object('Chemistry/courses/' + this.user_courses[x]);
             var actualCourse: any = Object.values(this.coursesObject);
             console.log("PLS =" + actualCourse);
             */
             //this.user_courseNames[x] = actualCourse[3];
           }
           //console.log(this.user_courseNames);
           //console.log(this.user_courseNames);
           //this.user_courses = this.userObject.name;
           
           
           
       }
     })

     


  }

  getCourses(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
    

  }

  beenSelected(): void{
    if (this.isSelected == false)
      this.isSelected = true;
    else
      this.isSelected = false;
  }
  
  getCoursesv2(listPath) : Observable<any[]>{
    return this.db.list(listPath).valueChanges();
  
  }

  onSelect(course: Observable<any>): void {
        //this.selectedCourse = course;
        var newCourseList: string;
        var courseCompare: string;
        let flag = 1;
      //  console.log(course);
        var currCourse: any[] = Object.values(course); 
       // console.log(currCourse);
        //console.log(currCourse[0]);

        this.sub = this.db.object('Chemistry/users/' + this.user_ID).valueChanges().subscribe(user => {
          if(user!=null)
          {
             var currUser: any = Object.values(user);
            // console.log(currUser);
             courseCompare = currUser[1].split(" ");
             let x = 0;
             for(x=0;x<courseCompare.length;x++)
             {
               if(courseCompare[x]===currCourse[0])
               {
                   flag = 0;
               }
             }
             if(flag==1)
             {
                if (currUser[1]==""){
                  newCourseList = currCourse[0];
                }
                else {
                  newCourseList= currUser[1] + " " + currCourse[0];
                }
               // console.log(newCourseList);
              //  console.log(newCourseList.length);
                this.db.object('Chemistry/users/' + this.user_ID).update({courseList: newCourseList}).then(_=> {
                  this.listCourses = [];
                })
                this.sub.unsubscribe();
            }
             
          }
        })
        this.isSelected = false;
        //this.db.object('Chemistry/users/' + this.user_ID).update({courseList: newCourseList});




        //this.db.object('Chemistry/users/' + this.user_ID).update({courseList: weeny[0]});  YEEET
        
        //console.log(course);
       // var useCourse : any = Object.values(course);
       // console.log("Trying to add this: " + course.courseCode);
        //this.db.object('Chemistry/users/' + this.user_ID).update({courseList: useCourse.courseCode});
        //this.isSelected = false;
        
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  delete(courseToDelete: string){
    let courseListRef = this.db.object<string>(`Chemistry/users/${this.user_ID}/courseList`);
    courseListRef.valueChanges().first().subscribe(courses => {
      courses = courses.split(' ').filter(course => course !== courseToDelete).join(' ');
      courseListRef.set(courses);
    });
  }

}
