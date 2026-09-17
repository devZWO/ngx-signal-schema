import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonoFont } from './mono-font';

describe('MonoFont', () => {
    let component: MonoFont;
    let fixture: ComponentFixture<MonoFont>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MonoFont],
        }).compileComponents();

        fixture = TestBed.createComponent(MonoFont);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
