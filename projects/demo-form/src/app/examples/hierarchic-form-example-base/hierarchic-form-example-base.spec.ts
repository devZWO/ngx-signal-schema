import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HierarchicFormExampleBase } from './hierarchic-form-example-base';
import { signal } from '@angular/core';
import { form, schema } from '@angular/forms/signals';
import { HierarchicFormModel } from '../hierarchic-model-example';

describe('HierarchicFormExampleBase', () => {
    let component: HierarchicFormExampleBase;
    let fixture: ComponentFixture<HierarchicFormExampleBase>;

    const mockModel: HierarchicFormModel = {
        type: 'natural',
        naturalPerson: { firstname: '', lastname: '', birthYear: '' },
        legalPerson: { companyName: '', legalForm: '', employeeCount: '', revenue: '' },
        contact: { phone: '', email: '', address: { zip: '', street: '', number: '' } }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HierarchicFormExampleBase],
        }).compileComponents();

        fixture = TestBed.createComponent(HierarchicFormExampleBase);
        component = fixture.componentInstance;

        const mockForm = TestBed.runInInjectionContext(() => form(signal(mockModel), schema<HierarchicFormModel>(() => {/** empty placeholder schema */})));
        fixture.componentRef.setInput('contactForm', mockForm);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
