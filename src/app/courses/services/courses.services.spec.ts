import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe("CoursesService", () => {

    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController

    beforeEach(() => {
        
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController)
    });

    it("Should retrive all courses", () => {

        coursesService.findAllCourses()
            .subscribe( courses => {
                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, "incorrect number of courses");

                const course = courses.find( course => course.id === 12);

                expect(course.titles.description).toBe("Angular Testing Course");
            })
        
        const req = httpTestingController.expectOne("/api/courses");

        expect(req.request.method).toEqual("GET");

        // stub
        req.flush({
            payload: Object.values(COURSES)
        })
        
    });


    it("Should retrieve a course that match a given Id", () => {

        coursesService.findCourseById(12)
            .subscribe( course => {
                expect(course).not.toBeNull('course does not exist!!');
                expect(course.id).toBe(12);
                expect(course.titles.description).toBe("Angular Testing Course");
            })

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("GET");

        req.flush(COURSES[12]);

    });

    it("Should save the course data", () => {
        const newCourseDescription: Partial<Course> = { 
            titles: { 
                description: "React Advanced Course", 

            }
        }

        coursesService.saveCourse(12, newCourseDescription)
            .subscribe( courseModified => {
                expect(courseModified).toBeTruthy('course cannot be updated');
                expect(courseModified.id).toBe(12); 
                expect(courseModified.titles.description).toBe("React Advanced Course");
            })

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("PUT");
        expect(req.request.body.titles.description).toEqual(newCourseDescription.titles.description);

        req.flush({
            ...COURSES[12],
            ...newCourseDescription
        })

    })

    it("Should fail when server responds with an error", () => {
        const changes: Partial<Course> = {
            titles: { description: "Testing Course"}
        }

        coursesService.saveCourse(12, changes)
            .subscribe(
                () => fail("the test should have been failed"),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                }
            )
        
        const req = httpTestingController.expectOne("/api/courses/12");

        expect(req.request.method).toEqual("PUT");

        req.flush("This is a failed Response", { status: 500, statusText: "The request failed with a status 500"})
    });

    it("Should find a list of lessons", () => {

        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy("Lessons cannot be find");
                
                expect(lessons.length).toBe(10);
            });

        const req = httpTestingController.expectOne(
            req => req.url == '/api/lessons');
        
        expect(req.request.method).toEqual("GET");

        expect(req.request.params.get("courseId")).toEqual("12")
        expect(req.request.params.get("filter")).toEqual("")
        expect(req.request.params.get("sortOrder")).toEqual("asc")
        expect(req.request.params.get("pageNumber")).toEqual("0")
        expect(req.request.params.get("pageSize")).toEqual("3")

        req.flush({
            payload: findLessonsForCourse(12)
        })
    })

    afterEach(() => {
        httpTestingController.verify();
    })
});