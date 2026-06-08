import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ErrorIndicator} from './error-indicator';
import {signal} from '@angular/core';

describe('ErrorIndicator', () => {
    let component: ErrorIndicator;
    let fixture: ComponentFixture<ErrorIndicator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ErrorIndicator],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorIndicator);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('fieldState', {
            errors: signal([]),
            hidden: signal(false),
            touched: signal(false),
            dirty: signal(false),
            valid: signal(true),
            value: signal(null),
        });

        await fixture.whenStable();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
