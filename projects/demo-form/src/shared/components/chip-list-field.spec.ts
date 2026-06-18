import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ChipListField} from './chip-list-field';
import {signal} from '@angular/core';
import {FieldTree, form, hidden, readonly, schema, SchemaPathTree} from '@angular/forms/signals';
import {MatAutocompleteSelectedEvent, MatOption} from '@angular/material/autocomplete';
import {MatChipInput, MatChipInputEvent} from '@angular/material/chips';
import {unique} from '@devzwo/ngx-signal-schema';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';

describe('ChipListField', () => {
    let component: ChipListField;
    let fixture: ComponentFixture<ChipListField>;

    const createFieldTree = (initialValue: string[] = [], schemaFn: (path: SchemaPathTree<{items: string[]}>) => void = () => { /* noop */ }) => {
        return TestBed.runInInjectionContext(() => {
            const model = signal({items: initialValue});
            const appSchema = schema<{items: string[]}>(schemaFn);
            const f = form(model, appSchema);
            return f.items;
        });
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChipListField],
        }).compileComponents();

        fixture = TestBed.createComponent(ChipListField);
        component = fixture.componentInstance;
    });

    it('should create', async () => {
        fixture.componentRef.setInput('fieldTree', createFieldTree());
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render chips for items in fieldTree', async () => {
        fixture.componentRef.setInput('fieldTree', createFieldTree(['Angular', 'Signals']));
        await fixture.whenStable();
        fixture.detectChanges();

        const chips = fixture.nativeElement.querySelectorAll('mat-chip-row');
        expect(chips.length).toBe(2);
        expect(chips[0].textContent).toContain('Angular');
        expect(chips[1].textContent).toContain('Signals');
    });

    it('should render label when provided', async () => {
        fixture.componentRef.setInput('fieldTree', createFieldTree());
        fixture.componentRef.setInput('label', 'My Label');
        await fixture.whenStable();
        fixture.detectChanges();

        const labelElement = fixture.nativeElement.querySelector('mat-label');
        expect(labelElement.textContent).toContain('My Label');
    });

    it('should add item when addItem is called', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['Angular']);
        fixture.componentRef.setInput('fieldTree', fieldTree);
        await fixture.whenStable();
        fixture.detectChanges();

        const event = {
            value: 'Vitest',
            chipInput: {
                clear: vi.fn(),
                inputElement: document.createElement('input'),
            } as unknown as MatChipInput
        } as MatChipInputEvent;

        // @ts-expect-error - testing protected method
        component.addItem(event);

        fixture.detectChanges();
        expect(fieldTree().value()).toEqual(['Vitest', 'Angular']);
        // @ts-expect-error - testing protected property
        expect(component.inputValue()).toBe('');
    });

    it('should remove item when removeItem is called', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['Angular', 'Signals']);
        fixture.componentRef.setInput('fieldTree', fieldTree);
        await fixture.whenStable();
        fixture.detectChanges();

        // @ts-expect-error - testing protected method
        component.removeItem(0);
        fixture.detectChanges();
        expect(fieldTree().value()).toEqual(['Signals']);
    });

    it('should filter suggestions', async () => {
        fixture.componentRef.setInput('fieldTree', createFieldTree(['Angular']));
        fixture.componentRef.setInput('suggestions', ['Angular', 'React', 'Vue']);
        await fixture.whenStable();
        fixture.detectChanges();

        // Already selected 'Angular' should be filtered out
        // @ts-expect-error - testing protected property
        expect(component.filteredSuggestions()).toEqual(['React', 'Vue']);

        // @ts-expect-error - testing protected property
        component.inputValue.set('re');
        fixture.detectChanges();
        // @ts-expect-error - testing protected property
        expect(component.filteredSuggestions()).toEqual(['React']);
    });

    it('should add item when selectSuggestion is called', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['Angular']);
        fixture.componentRef.setInput('fieldTree', fieldTree);
        fixture.componentRef.setInput('suggestions', ['React', 'Vue']);
        await fixture.whenStable();
        fixture.detectChanges();

        const event = {
            option: {
                value: 'React',
                deselect: vi.fn()
            } as unknown as MatOption
        } as MatAutocompleteSelectedEvent;

        // @ts-expect-error - testing protected method
        component.selectSuggestion(event);

        fixture.detectChanges();
        expect(fieldTree().value()).toEqual(['React', 'Angular']);
        // @ts-expect-error - testing protected property
        expect(component.inputValue()).toBe('');
    });

    it('should reorder items on drop', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['A', 'B', 'C']);
        fixture.componentRef.setInput('fieldTree', fieldTree);
        await fixture.whenStable();
        fixture.detectChanges();

        // @ts-expect-error - testing protected method
        component.onDrop({
            previousIndex: 0,
            currentIndex: 2,
            item: {} as CdkDrag,
            container: {} as CdkDropList<string[]>,
            previousContainer: {} as CdkDropList<string[]>,
            isPointerOverContainer: true,
            distance: {x: 0, y: 0},
            dropPoint: {x: 0, y: 0},
            event: new MouseEvent('drop'),
        } as CdkDragDrop<string[]>);

        fixture.detectChanges();
        expect(fieldTree().value()).toEqual(['B', 'C', 'A']);
    });

    it('should not reorder items if readonly or disabled', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['A', 'B'], (path) => {
            readonly(path.items, {when: () => true});
        });

        fixture.componentRef.setInput('fieldTree', fieldTree);
        await fixture.whenStable();
        fixture.detectChanges();

        // @ts-expect-error - testing protected method
        component.onDrop({
            previousIndex: 0,
            currentIndex: 1,
            item: {} as CdkDrag,
            container: {} as CdkDropList<string[]>,
            previousContainer: {} as CdkDropList<string[]>,
            isPointerOverContainer: true,
            distance: {x: 0, y: 0},
            dropPoint: {x: 0, y: 0},
            event: new MouseEvent('drop'),
        } as CdkDragDrop<string[]>);

        fixture.detectChanges();
        expect(fieldTree().value()).toEqual(['A', 'B']); // No change
    });

    it('should not render anything if hidden', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['A', 'B'], (path) => {
            hidden(path.items, {when: () => true});
        });

        fixture.componentRef.setInput('fieldTree', fieldTree);
        await fixture.whenStable();
        fixture.detectChanges();

        const formField = fixture.nativeElement.querySelector('mat-form-field');
        expect(formField).toBeNull();
    });

    it('should show warning icon when item is invalid', async () => {
        const fieldTree: FieldTree<string[]> = createFieldTree(['Duplicate', 'Duplicate'], (path) => {
            unique(path.items, {
                error: {message: 'Must be unique'},
                destination: () => 'items'
            });
        });

        fixture.componentRef.setInput('fieldTree', fieldTree);
        await fixture.whenStable();
        fixture.detectChanges();

        // The warning icon is rendered inside a mat-chip-row when item().invalid() is true
        const warnIcons = fixture.nativeElement.querySelectorAll('mat-icon');
        const warnIcon = Array.from(warnIcons).find((icon): icon is HTMLElement => icon instanceof HTMLElement && icon.textContent === 'warning');
        expect(warnIcon).toBeTruthy();
    });
});
