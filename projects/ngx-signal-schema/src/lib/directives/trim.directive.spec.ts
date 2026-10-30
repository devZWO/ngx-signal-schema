import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it, vi} from 'vitest';
import {TrimDirective} from './trim.directive';
import {form, FormField} from '@angular/forms/signals';

@Component({
    imports: [TrimDirective],
    template: `
        <input id="default-input" trim />
        <input id="ctrl-char-input" trim [trimControlCharacters]="true" />
        <textarea id="textarea-input" trim></textarea>
        <input id="toggle-input" [trim]="trimEnabled()" />
        <input id="disabled-input" trim disabled />
        <input id="readonly-input" trim readonly />
    `,
})
class TestHostComponent {
    trimEnabled = signal(true);
}

@Component({
    imports: [TrimDirective, FormField],
    template: `
        <input id="form-input" trim [formField]="testForm.name" />
    `,
})
class FormTestHostComponent {
    model = signal({ name: '' });
    testForm = form(this.model);
}

describe('TrimDirective', () => {
    describe('Host elements and attributes', () => {
        let fixture: ComponentFixture<TestHostComponent>;
        let host: TestHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TestHostComponent);
            host = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should trim leading and trailing whitespace on input blur', () => {
            const inputEl = fixture.nativeElement.querySelector('#default-input') as HTMLInputElement;

            inputEl.value = '   hello world   ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('hello world');
        });

        it('should convert whitespace-only strings to empty string on blur', () => {
            const inputEl = fixture.nativeElement.querySelector('#default-input') as HTMLInputElement;

            inputEl.value = '   \t\n  ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('');
        });

        it('should not trim control characters when trimControlCharacters is false by default', () => {
            const inputEl = fixture.nativeElement.querySelector('#default-input') as HTMLInputElement;

            inputEl.value = ' \x01 hello \x02 ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('\x01 hello \x02');
        });

        it('should trim ASCII and Unicode control characters when trimControlCharacters is true', () => {
            const inputEl = fixture.nativeElement.querySelector('#ctrl-char-input') as HTMLInputElement;

            inputEl.value = '\x01\x1F  hello world \x00\x02';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('hello world');
        });

        it('should reduce control-characters-only strings to empty string when trimControlCharacters is true', () => {
            const inputEl = fixture.nativeElement.querySelector('#ctrl-char-input') as HTMLInputElement;

            inputEl.value = '\x00\x01\x1F  \t\n';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('');
        });

        it('should trim textarea values on blur while preserving internal linebreaks', () => {
            const textareaEl = fixture.nativeElement.querySelector('#textarea-input') as HTMLTextAreaElement;

            textareaEl.value = '  line 1\n  line 2  \n  ';
            textareaEl.dispatchEvent(new Event('blur'));

            expect(textareaEl.value).toBe('line 1\n  line 2');
        });

        it('should not trim when trim input is dynamically set to false', () => {
            const inputEl = fixture.nativeElement.querySelector('#toggle-input') as HTMLInputElement;

            host.trimEnabled.set(false);
            fixture.detectChanges();

            inputEl.value = '   untouched   ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('   untouched   ');
        });

        it('should not trim when element is disabled', () => {
            const inputEl = fixture.nativeElement.querySelector('#disabled-input') as HTMLInputElement;

            inputEl.value = '   disabled value   ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('   disabled value   ');
        });

        it('should not trim when element is readonly', () => {
            const inputEl = fixture.nativeElement.querySelector('#readonly-input') as HTMLInputElement;

            inputEl.value = '   readonly value   ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('   readonly value   ');
        });

        it('should dispatch input and change events when value changes on blur', () => {
            const inputEl = fixture.nativeElement.querySelector('#default-input') as HTMLInputElement;
            const inputSpy = vi.fn();
            const changeSpy = vi.fn();

            inputEl.addEventListener('input', inputSpy);
            inputEl.addEventListener('change', changeSpy);

            inputEl.value = '  modified value  ';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputSpy).toHaveBeenCalledTimes(1);
            expect(changeSpy).toHaveBeenCalledTimes(1);
        });

        it('should not dispatch events when value is already trimmed', () => {
            const inputEl = fixture.nativeElement.querySelector('#default-input') as HTMLInputElement;
            const inputSpy = vi.fn();
            const changeSpy = vi.fn();

            inputEl.addEventListener('input', inputSpy);
            inputEl.addEventListener('change', changeSpy);

            inputEl.value = 'already-clean';
            inputEl.dispatchEvent(new Event('blur'));

            expect(inputEl.value).toBe('already-clean');
            expect(inputSpy).not.toHaveBeenCalled();
            expect(changeSpy).not.toHaveBeenCalled();
        });
    });

    describe('Signal Forms integration', () => {
        let fixture: ComponentFixture<FormTestHostComponent>;
        let host: FormTestHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [FormTestHostComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(FormTestHostComponent);
            host = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should update signal form model when input is trimmed on blur', () => {
            const inputEl = fixture.nativeElement.querySelector('#form-input') as HTMLInputElement;

            inputEl.value = '   Signal Forms User   ';
            inputEl.dispatchEvent(new Event('blur'));
            fixture.detectChanges();

            expect(inputEl.value).toBe('Signal Forms User');
            expect(host.testForm.name().value()).toBe('Signal Forms User');
            expect(host.model().name).toBe('Signal Forms User');
        });
    });
});
