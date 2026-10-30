import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';
import {InputFormField} from './input-form-field';
import {signal} from '@angular/core';
import {FieldTree, form, hidden, schema, SchemaPathTree} from '@angular/forms/signals';

describe('InputFormField', () => {
    let component: InputFormField;
    let fixture: ComponentFixture<InputFormField>;

    const createFieldTree = (
        initialValue = '',
        schemaFn: (path: SchemaPathTree<{ text: string }>) => void = () => { /* noop */ }
    ): FieldTree<string> => {
        return TestBed.runInInjectionContext(() => {
            const model = signal({ text: initialValue });
            const appSchema = schema<{ text: string }>(schemaFn);
            const f = form(model, appSchema);
            return f.text;
        });
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputFormField],
        }).compileComponents();

        fixture = TestBed.createComponent(InputFormField);
        component = fixture.componentInstance;
    });

    it('should create and render label and placeholder', async () => {
        const fieldTree = createFieldTree('initial text');
        fixture.componentRef.setInput('fieldTree', fieldTree);
        fixture.componentRef.setInput('label', 'User Name');
        fixture.componentRef.setInput('placeholder', 'Enter name');

        await fixture.whenStable();
        fixture.detectChanges();

        expect(component).toBeTruthy();
        const label = fixture.nativeElement.querySelector('mat-label');
        const input = fixture.nativeElement.querySelector('input');

        expect(label.textContent).toContain('User Name');
        expect(input.placeholder).toBe('Enter name');
        expect(input.value).toBe('initial text');
    });

    it('should hide input when hidden() signal is true', async () => {
        const fieldTree = createFieldTree('test', (path) => {
            hidden(path.text, () => true);
        });

        fixture.componentRef.setInput('fieldTree', fieldTree);
        fixture.componentRef.setInput('label', 'Hidden Field');

        await fixture.whenStable();
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input');
        expect(input).toBeNull();
    });

    it('should trim whitespace on blur by default', async () => {
        const fieldTree = createFieldTree('');
        fixture.componentRef.setInput('fieldTree', fieldTree);
        fixture.componentRef.setInput('label', 'Trim Field');

        await fixture.whenStable();
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = '   trimmed text   ';
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(input.value).toBe('trimmed text');
        expect(fieldTree().value()).toBe('trimmed text');
    });

    it('should not trim when trim is set to false', async () => {
        const fieldTree = createFieldTree('');
        fixture.componentRef.setInput('fieldTree', fieldTree);
        fixture.componentRef.setInput('label', 'No Trim Field');
        fixture.componentRef.setInput('trim', false);

        await fixture.whenStable();
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = '   untouched text   ';
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(input.value).toBe('   untouched text   ');
    });

    it('should trim control characters when trimControlCharacters is set to true', async () => {
        const fieldTree = createFieldTree('');
        fixture.componentRef.setInput('fieldTree', fieldTree);
        fixture.componentRef.setInput('label', 'Control Chars Field');
        fixture.componentRef.setInput('trimControlCharacters', true);

        await fixture.whenStable();
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = '\x01  hello \x02';
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(input.value).toBe('hello');
        expect(fieldTree().value()).toBe('hello');
    });
});
