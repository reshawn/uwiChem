import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  coursesObservable: Observable<any[]>;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.coursesObservable = this.getCourses('/');
  }

  getCourses(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

}
