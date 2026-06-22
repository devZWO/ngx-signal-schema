import {Component, computed, input, model} from '@angular/core';
import {MatChipAvatar, MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatOption} from '@angular/material/autocomplete';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDragPreview, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {FieldTree} from '@angular/forms/signals';
import {ErrorIndicator} from './error-indicator';

/**
 * A form field component for managing a list of chips (strings).
 * Features include drag-and-drop reordering, removal, and autocomplete suggestions.
 *
 * @example
 * ```html
 * <app-chip-list-field
 *   [fieldTree]="form.mySuperHeroSkills"
 *   [suggestions]="suggestions"
 *   label="Super Hero Skills"
 *   inputPlaceholder="Add a skill..."
 * />
 * ```
 */
@Component({
    selector: 'app-chip-list-field',
    imports: [
        MatChipGrid,
        MatChipInput,
        MatChipRemove,
        MatChipRow,
        MatFormField,
        MatIcon,
        MatLabel,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatAutocomplete,
        MatOption,
        FormsModule,
        CdkDropList,
        CdkDrag,
        CdkDragPreview,
        CdkDragPlaceholder,
        CdkDragHandle,
        MatChipAvatar,
        ErrorIndicator,
    ],
    template: `
        @if (!fieldTree()().hidden()) {

            <mat-form-field class="w-full">
                @if (label()) {
                    <mat-label>{{ label() }}</mat-label>
                }
                <mat-chip-grid
                    #chipGrid
                    [attr.aria-label]="label()"
                    cdkDropList
                    cdkDropListOrientation="mixed"
                    [cdkDropListDisabled]="fieldTree()().readonly() || fieldTree()().disabled()"
                    [cdkDropListData]="fieldTree()().value()"
                    (cdkDropListDropped)="onDrop($event)"
                >
                    @for (item of fieldTree(); track $index; let i = $index) {
                        @let value = item().value();

                        <mat-chip-row
                            cdkDrag
                            cdkDragHandle
                            [cdkDragData]="{ index: i }"
                            (removed)="removeItem(i)"
                        >
                            @if (item().invalid()) {
                                <button matChipAvatar [attr.aria-label]="'warn ' + value">
                                    <mat-icon class="text-red-500!">warning</mat-icon>
                                </button>
                            }

                            {{ value }}

                            @if (!fieldTree()().readonly() && !fieldTree()().disabled()) {
                                <button matChipRemove [attr.aria-label]="'remove ' + value">
                                    <mat-icon>cancel</mat-icon>
                                </button>
                            }

                            <!-- clean preview/placeholer -->
                            <ng-template cdkDragPreview>
                                <mat-chip-row class="chip-preview">{{ value }}</mat-chip-row>
                            </ng-template>

                            <ng-template cdkDragPlaceholder>
                                <mat-chip-row class="chip-placeholder">
                                    @if (item().invalid()) {
                                        <button matChipAvatar [attr.aria-label]="'warn ' + value">
                                            <mat-icon class="text-red-500!">warning</mat-icon>
                                        </button>
                                    }

                                    {{ value }}

                                    @if (!fieldTree()().readonly() && !fieldTree()().disabled()) {
                                        <button matChipRemove disabled>
                                            <mat-icon>cancel</mat-icon>
                                        </button>
                                    }
                                </mat-chip-row>
                            </ng-template>

                        </mat-chip-row>
                    }
                </mat-chip-grid>

                <input
                    #itemInput
                    [placeholder]="inputPlaceholder()"
                    [matAutocomplete]="auto"
                    [(ngModel)]="inputValue"
                    [ngModelOptions]="{standalone: true}"

                    [readonly]="fieldTree()().readonly()"
                    [disabled]="fieldTree()().disabled()"
                    [matChipInputFor]="chipGrid"
                    (matChipInputTokenEnd)="addItem($event)"
                />
                <mat-autocomplete
                    #auto="matAutocomplete"
                    (optionSelected)="selectSuggestion($event); itemInput.value = ''"
                >
                    @for (suggestion of filteredSuggestions(); track suggestion) {
                        <mat-option [value]="suggestion">{{ suggestion }}</mat-option>
                    }
                </mat-autocomplete>
            </mat-form-field>
            <mat-error appErrorIndicator [fieldState]="fieldTree()()" class="text-red-500!"/>
        }
    `,
    styles: `
        .grab-handle {
            cursor: grab;
        }

        /* while dragging */
        .cdk-drag-preview {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            opacity: 0.7;
        }

        .cdk-drag-animating {
            transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
        }

        .cdk-drag {
            transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
        }

        /* placeholder in the list for the dragged element */
        .cdk-drag-placeholder {
            opacity: 0.5;
        }
    `,
})
export class ChipListField {

    /** The signal-based field tree from `@angular/forms/signals` representing an array of strings. */
    public readonly fieldTree = input.required<FieldTree<string[]>>();

    /** The label for the chip list field. */
    public readonly label = input<string>('');

    /** The placeholder text for the chip input field. */
    public readonly inputPlaceholder = input<string>('');

    /** A list of available suggestions for the autocomplete dropdown. */
    public readonly suggestions = input<string[]>([]);

    /** The current value of the input field, used for filtering suggestions. */
    protected readonly inputValue = model('');

    /**
     * Computed signal that filters suggestions based on the current input value
     * and excludes already selected items.
     */
    protected readonly filteredSuggestions = computed(() => {
        const query = this.inputValue()?.toLowerCase();
        const selectedItems = this.fieldTree()().value();
        const suggestions = this.suggestions().filter(suggestion =>
            !selectedItems?.some(selected => selected.toLowerCase() === suggestion.toLowerCase())
        );

        return query
            ? suggestions.filter(suggestion => suggestion.toLowerCase().includes(query))
            : suggestions;
    });

    /**
     * Handles the drag-and-drop event to reorder items in the list.
     * @param event The CDK drag-drop event containing previous and current indices.
     */
    protected onDrop(event: CdkDragDrop<string[]>): void {
        if(this.fieldTree()().readonly() || this.fieldTree()().disabled()) {
            return;
        }
        this.fieldTree()().value.update(items => {
            const newItems = [...items];
            moveItemInArray(newItems, event.previousIndex, event.currentIndex);
            return newItems;
        });
    }

    /**
     * Removes an item from the list at the specified index.
     * @param index The index of the item to remove.
     */
    protected removeItem(index: number) {
        this.fieldTree()().value.update(items => items.filter((_, i) => i !== index));
    }

    /**
     * Adds a new item to the list from the chip input event.
     * @param event The Material chip input event.
     */
    protected addItem(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.addValue(value);
        }

        event.chipInput?.clear();
        this.inputValue.set('');
    }

    /**
     * Adds a selected suggestion to the list and clears the input.
     * @param event The Material autocomplete selection event.
     */
    protected selectSuggestion(event: MatAutocompleteSelectedEvent): void {
        this.addValue(event.option.value);
        this.inputValue.set('');
        event.option.deselect();
    }

    /**
     * Internal helper to prepend a value to the field tree's array.
     * @param value The string value to add.
     */
    private addValue(value: string) {
        this.fieldTree()().value.update(items => [value, ...items]);
    }

}
