import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {applyWhen, disabled, form, hidden, readonly, schema} from '@angular/forms/signals';
import {unique, ValidationDestination} from '@devzwo/ngx-signal-schema';
import {ChipListField} from '../../shared/components/chip-list-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

export interface ArrayFormModel {
    mySuperHeroSkills: string[];
}


@Component({
    selector: 'app-array-example',
    imports: [
        ChipListField,
        MatCheckboxModule,
        MatRadioModule
    ],
    template: `
        <section class="flex flex-col gap-6">
            <h1 class="text-3xl font-bold text-cyan-700">Array Validation (unique item)</h1>

            <div class="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
                <h2 class="text-lg font-semibold text-cyan-800">Validation Configuration</h2>

                <mat-checkbox
                    [checked]="isValidationEnabled()"
                    (change)="isValidationEnabled.set($event.checked)"
                    color="primary">
                    Enable Unique Validation
                </mat-checkbox>

                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-medium text-gray-700">Field Enable State:</h3>
                    <mat-radio-group
                        [value]="enableState()"
                        (change)="enableState.set($event.value)"
                        class="flex flex-wrap gap-4">
                        <mat-radio-button value="">Read/Write</mat-radio-button>
                        <mat-radio-button value="readonly">readonly</mat-radio-button>
                        <mat-radio-button value="hidden">hidden</mat-radio-button>
                        <mat-radio-button value="disabled">disabled</mat-radio-button>
                    </mat-radio-group>
                    <p class="text-xs text-gray-500 italic">
                        @if (enableState() === 'readonly') {
                            Sets the Array to 'readonly'.
                        } @else if (enableState() === 'hidden') {
                            Sets the Array to 'hidden'.
                        } @else if (enableState() === 'disabled') {
                            Sets the Array to 'disabled'.
                        } @else {
                            Enables the Array
                        }
                    </p>
                </div>

                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-medium text-gray-700">Error Destination (uniqueness):</h3>
                    <mat-radio-group
                        [value]="validationDestination()"
                        (change)="validationDestination.set($event.value)"
                        class="flex flex-wrap gap-4">
                        <mat-radio-button value="items">Leaf (Items)</mat-radio-button>
                        <mat-radio-button value="container">Node (Array)</mat-radio-button>
                        <mat-radio-button value="both">Both</mat-radio-button>
                    </mat-radio-group>
                    <p class="text-xs text-gray-500 italic">
                        @if (validationDestination() === 'items') {
                            Errors are attached to each duplicate item.
                        } @else if (validationDestination() === 'container') {
                            A single error is attached to the array itself.
                        } @else {
                            Errors are attached to both the array and duplicate items.
                        }
                    </p>
                </div>
            </div>

            <app-chip-list-field [fieldTree]="form.mySuperHeroSkills" [suggestions]="suggestions" label="Super Hero Skills" inputPlaceholder="Drink 20 Coffee"/>

        </section>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayExample {

    protected readonly isValidationEnabled = signal(true);
    protected readonly enableState = signal<'' | 'readonly' | 'hidden' | 'disabled'>('');
    protected readonly validationDestination = signal<ValidationDestination>('items');

    private readonly contactModel: ArrayFormModel = {
        mySuperHeroSkills: []
    };

    protected readonly suggestions = [
        "Drink 20 Coffee each day",
        "Resist to drink Coffee",
        "Fix Bugs before they emerge",
        "Exit Vim on the first try",
        "Resolve merge conflicts by sheer willpower",
        "Deploy to production on Friday at 4:59 PM",
        "Write code that works on the first run",
        "Explain the difference between null and undefined to a cat",
        "Refactor an entire legacy codebase in one lunch break",
        "Locate the missing semicolon in a 1000-line file without an IDE"
    ]

    private readonly appSchema = schema<ArrayFormModel>((path) => {
        applyWhen(path.mySuperHeroSkills, () => this.isValidationEnabled(), (p) => {
            unique(p, {
                error: {message: 'Superhero skills must be unique'},
                destination: () => this.validationDestination()
            });
        });
        hidden(path.mySuperHeroSkills, {when: () => this.enableState() === 'hidden'})
        readonly(path.mySuperHeroSkills, {when: () => this.enableState() === 'readonly'})
        disabled(path.mySuperHeroSkills, {when: () => this.enableState() === 'disabled'})
    });

    /**
     * Initialization of the form with initial values and schema.
     */
    protected readonly form = form(signal<ArrayFormModel>(this.contactModel), this.appSchema);
}
