import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it, beforeEach} from 'vitest';
import {RequiredExtendedExample} from './required-limitations-field';
import {SimplifiedRequiredExtendedExample} from './required-limitations-field-simplified';

describe('RequiredExtendedExample', () => {
    let fixture: ComponentFixture<RequiredExtendedExample>;
    let component: RequiredExtendedExample;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RequiredExtendedExample],
        }).compileComponents();

        fixture = TestBed.createComponent(RequiredExtendedExample);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create with initial invalid state', () => {
        expect(component).toBeTruthy();
        // @ts-expect-error - testing protected property
        expect(component.exampleForm().invalid()).toBe(true);
    });

    it('should behave according to selected name validator type', async () => {
        // @ts-expect-error - testing protected property
        const form = component.exampleForm;

        // 1. Default 'required' allows whitespace-only
        form.name().value.set('   ');
        fixture.detectChanges();
        expect(form.name().valid()).toBe(true);

        // 2. Switch to 'requiredTrimmed' -> whitespace-only is invalid
        // @ts-expect-error - testing protected property
        component.nameValidatorType.set('requiredTrimmed');
        fixture.detectChanges();
        expect(form.name().valid()).toBe(false);

        // Valid non-whitespace value
        form.name().value.set('John Doe');
        fixture.detectChanges();
        expect(form.name().valid()).toBe(true);

        // 3. Switch to 'notOnlyBlank' -> whitespace-only is invalid, but empty string is valid (optional)
        // @ts-expect-error - testing protected property
        component.nameValidatorType.set('notOnlyBlank');
        form.name().value.set('   ');
        fixture.detectChanges();
        expect(form.name().valid()).toBe(false);

        form.name().value.set('');
        fixture.detectChanges();
        expect(form.name().valid()).toBe(true);
    });

    it('should sanitize input on blur when trim is enabled', async () => {
        // @ts-expect-error - testing protected property
        component.trimEnabled.set(true);
        fixture.detectChanges();

        const inputEl = fixture.nativeElement.querySelector('input[placeholder="<First Name> <Last Name>"]') as HTMLInputElement;
        expect(inputEl).toBeTruthy();

        inputEl.value = '   Jane Doe   ';
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('Jane Doe');
        // @ts-expect-error - testing protected property
        expect(component.exampleForm.name().value()).toBe('Jane Doe');
    });

    it('should sanitize control characters on blur when trimControlCharacters is enabled', async () => {
        // @ts-expect-error - testing protected property
        component.trimEnabled.set(true);
        // @ts-expect-error - testing protected property
        component.trimControlCharacters.set(true);
        fixture.detectChanges();

        const inputEl = fixture.nativeElement.querySelector('input[placeholder="<First Name> <Last Name>"]') as HTMLInputElement;
        inputEl.value = '\x01  Jane Doe \x02';
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('Jane Doe');
        // @ts-expect-error - testing protected property
        expect(component.exampleForm.name().value()).toBe('Jane Doe');
    });

    it('should validate publish options with requiredDefined', async () => {
        // @ts-expect-error - testing protected property
        const form = component.exampleForm;

        // Default 'required' treats false as invalid
        form.publish().value.set(false);
        fixture.detectChanges();
        expect(form.publish().valid()).toBe(false);

        // 'requiredDefined' treats false as valid
        // @ts-expect-error - testing protected property
        component.publishValidatorType.set('requiredDefined');
        fixture.detectChanges();
        expect(form.publish().valid()).toBe(true);

        // 'requiredDefined' treats null as invalid
        form.publish().value.set(null);
        fixture.detectChanges();
        expect(form.publish().valid()).toBe(false);
    });
});

describe('SimplifiedRequiredExtendedExample', () => {
    let fixture: ComponentFixture<SimplifiedRequiredExtendedExample>;
    let component: SimplifiedRequiredExtendedExample;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SimplifiedRequiredExtendedExample],
        }).compileComponents();

        fixture = TestBed.createComponent(SimplifiedRequiredExtendedExample);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create with initial invalid state', () => {
        expect(component).toBeTruthy();
        // @ts-expect-error - testing protected property
        expect(component.exampleForm().invalid()).toBe(true);
    });

    it('should trim name input on blur when trimEnabled is true', async () => {
        // @ts-expect-error - testing protected property
        component.trimEnabled.set(true);
        fixture.detectChanges();

        const inputEl = fixture.nativeElement.querySelector('#name') as HTMLInputElement;
        inputEl.value = '   Sample Name   ';
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('Sample Name');
        // @ts-expect-error - testing protected property
        expect(component.exampleForm.name().value()).toBe('Sample Name');
    });

    it('should trim control characters when trimControlCharacters is true', async () => {
        // @ts-expect-error - testing protected property
        component.trimEnabled.set(true);
        // @ts-expect-error - testing protected property
        component.trimControlCharacters.set(true);
        fixture.detectChanges();

        const inputEl = fixture.nativeElement.querySelector('#name') as HTMLInputElement;
        inputEl.value = '\x01\x1F   Sample Name   \x02';
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('Sample Name');
        // @ts-expect-error - testing protected property
        expect(component.exampleForm.name().value()).toBe('Sample Name');
    });
});
