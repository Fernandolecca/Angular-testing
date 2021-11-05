import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import { Course } from '../model/course';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let element: DebugElement;
  let coursesService: any;
  const beginnersCourses = setupCourses()
    .filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses()
    .filter(course => course.category === 'ADVANCED');

  beforeEach( waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", ["findAllCourses"])

    TestBed.configureTestingModule({
        imports: [ 
            CoursesModule,
            NoopAnimationsModule
        ],
        providers: [
            { provide: CoursesService, useValue: coursesServiceSpy }
        ]
    })
    .compileComponents()
    .then(() => {

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
    })
 
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {

     coursesService.findAllCourses.and.returnValue( 
       of<Course[]>(beginnersCourses)
      );

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of<Course[]>(advancedCourses)
    );
    
    fixture.detectChanges();
    
    const tabs = element.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
    
  });


  it("should display both tabs", () => {
   coursesService.findAllCourses.and.returnValue(
     of<Course[]>(setupCourses())
   )

   fixture.detectChanges();

   const tabs = element.queryAll(By.css(".mat-tab-label"));
   expect(tabs.length).toBe(2, "Expected to find two tabs")
  
  });


  it("should display advanced courses when tab clicked - fakeAsync", () => {
    coursesService.findAllCourses.and.returnValue(
      of<Course[]>(setupCourses())
    );

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mat-tab-label"));

    // element.nativeElement.click();
    click(tabs[1]);

    fixture.detectChanges();
    
    const cardTitles = element.queryAll(By.css(".mat-card-title"));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
     
  });


  // it("should display advanced courses when tab clicked - async", waitForAsync(() => {

  //     pending();

  // }));


});





















