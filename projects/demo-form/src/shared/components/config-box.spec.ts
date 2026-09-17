import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBox } from './config-box';

describe('ConfigBox', () => {
    let component: ConfigBox;
    let fixture: ComponentFixture<ConfigBox>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigBox],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfigBox);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
