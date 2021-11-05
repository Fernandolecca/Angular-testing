import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service"

describe("CalculatorService Tests", ( ) => {
    // DOC -- dependent of component
    // const logger = new LoggerService; 
    let calculator: CalculatorService;
    let loggerSpy: any;

    beforeEach(() => {
        loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: loggerSpy}
            ]
        });

        // calculator = new CalculatorService(loggerSpy);
        calculator = TestBed.inject(CalculatorService);
    })

    it("Should add two numbers", () => {
        // spyOn(logger, "log");
        
        const actual = calculator.add(2, 2);
        const expected = 4;

        expect(actual).toBe(expected);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
        
    });

    it("Should substract two numbers", () => {
        const actual = calculator.subtract(2, 2);
        const expected = 0;

        // expect(actual).toBe(expected, "unexpected substraction result!");
        expect(actual).toBe(expected);
    });
});

