import {Component, signal} from '@angular/core';
import {applyWhen, form, required, RootFieldContext, schema, SchemaPathTree, validateTree} from '@angular/forms/signals';
import {ContactData, LegalPerson, NaturalPerson, PersonType} from '../../contact-model';
import {inactive, not, requiredAtLeastOne, valueEquals} from '@devzwo/ngx-signal-schema';
import {HierarchicFormExampleBase} from '../hierarchic-form-example-base/hierarchic-form-example-base';
import {atLeastOne} from './at-least-one';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';


export interface HierarchicFormModel {
    type: PersonType;
    naturalPerson: NaturalPerson;
    legalPerson: LegalPerson;
    contact: ContactData;
}


@Component({
    selector: 'app-at-least-one-criteria-example',
    imports: [
        HierarchicFormExampleBase,
        MatButton,
        MatCheckbox,
        MatRadioButton,
        MatRadioGroup
    ],
    template: `
        <section class="flex flex-col gap-6">
            <h1 class="text-3xl font-bold text-cyan-700">Search Form</h1>
            <h2 class="text-xl font-bold text-cyan-800">Optional fields but at least one is requried</h2>

            <div class="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
                <h2 class="text-lg font-semibold text-cyan-800">Validation Configuration</h2>

                <mat-checkbox
                    [checked]="isValidationEnabled()"
                    (change)="isValidationEnabled.set($event.checked)"
                    color="primary"
                >
                    Enable Unique Validation
                </mat-checkbox>


                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-medium text-gray-700">Error Destination (uniqueness):</h3>
                    <mat-radio-group
                        [value]="schemaDefinition()"
                        (change)="schemaDefinition.set($event.value)"
                        class="grid grid-cols-2 gap-4"
                    >
                        <mat-radio-button value="WAY1">Way 1 - Simple required(&#123;when: true&#125;)</mat-radio-button>
                        <mat-radio-button value="WAY2">Way 2 - Complex logic knowing the context</mat-radio-button>
                        <mat-radio-button value="WAY3">Way 3 - Usage of validateTree</mat-radio-button>
                        <mat-radio-button value="WAY4">Way 4 - Extracted Validator</mat-radio-button>
                        <mat-radio-button value="WAY5">Way 5 - Extended validateTree usage</mat-radio-button>
                    </mat-radio-group>
                    <p class="text-xs text-gray-500 italic">
                        @switch (schemaDefinition()) {
                            @case ('WAY1') {
                                Extended usage of basic required(&#123;when: true&#125;). phone is required when no other field is filled.
                            }
                            @case ('WAY2') {
                                Complex validation logic, but needs knowledge of the structure. phone and firstname are required when no other field is filled.
                            }
                            @case ('WAY3') {
                                Using validateTree takes a deep look into the fieldTree. this avoids having to know the structure.
                            }
                            @case ('WAY4') {
                                The same like WAY3 but extracted as a reusable validator.
                            }
                            @case ('WAY5') {
                                This extension, uses recursion logic to inspect each subtree.
                            }
                            @default {
                                Select a schema
                            }
                        }
                    </p>
                </div>
            </div>

            <app-hierarchic-form-example-base [contactForm]="contactForm"/>

            <button mat-button [disabled]="contactForm().invalid()">Submit</button>

        </section>
    `,
})
export class SearchAtLeastOneCriteriaExampleComponent {

    protected isValidationEnabled = signal<boolean>(true);
    protected schemaDefinition = signal<'WAY1' | 'WAY2' | 'WAY3' | 'WAY4' | 'WAY5'>('WAY1');


    private readonly contactModel: HierarchicFormModel = {
        type: 'natural',
        naturalPerson: {
            firstname: '',
            lastname: '',
            birthYear: '',
        },
        legalPerson: {
            companyName: '',
            legalForm: '',
            employeeCount: '',
            revenue: ''
        },
        contact: {
            phone: '',
            email: '',
            address: {
                zip: '',
                street: '',
                number: ''
            }
        }
    };

    private readonly needPhoneWhenNoOtherFieldIsFilled = schema<HierarchicFormModel>((path) => {
        required(path.contact.phone, {
            when: (ctx) => {
                const otherFields = [
                    ctx.valueOf(path.contact.email),
                    ctx.valueOf(path.contact.address.zip),
                    ctx.valueOf(path.contact.address.street),
                    ctx.valueOf(path.contact.address.number),
                ];

                if (ctx.valueOf(path.type) === 'natural') {
                    otherFields.push(
                        ctx.valueOf(path.naturalPerson.firstname),
                        ctx.valueOf(path.naturalPerson.lastname),
                        ctx.valueOf(path.naturalPerson.birthYear),
                    );
                } else {
                    otherFields.push(
                        ctx.valueOf(path.legalPerson.companyName),
                        ctx.valueOf(path.legalPerson.legalForm),
                        ctx.valueOf(path.legalPerson.employeeCount),
                        ctx.valueOf(path.legalPerson.revenue),
                    );
                }

                return otherFields.every(value => value == null || value === '');
            }
        })
    });

    private readonly atLeastOneCriteriaSchema = schema<HierarchicFormModel>((path) => {
        const isFilled = (val: unknown) => val != null && val !== '';

        const getRelevantFields = (ctx: RootFieldContext<unknown>): SchemaPathTree<unknown>[] => {
            const common = [
                path.contact.phone,
                path.contact.email,
                path.contact.address.zip,
                path.contact.address.street,
                path.contact.address.number,
            ];

            if (ctx.valueOf(path.type) === 'natural') {
                return [...common, path.naturalPerson.firstname, path.naturalPerson.lastname, path.naturalPerson.birthYear];
            } else {
                return [...common, path.legalPerson.companyName, path.legalPerson.legalForm, path.legalPerson.employeeCount, path.legalPerson.revenue];
            }
        };

        const isAnyOtherFieldFilled = (ctx: RootFieldContext<unknown>, currentPath: SchemaPathTree<unknown>) => {
            return getRelevantFields(ctx)
                .filter(f => f !== currentPath)
                .some(f => isFilled(ctx.valueOf(f)));
        };

        required(path.contact.phone, {
            when: (ctx) => !isAnyOtherFieldFilled(ctx, path.contact.phone)
        });

        required(path.naturalPerson.firstname, {
            when: (ctx) => ctx.valueOf(path.type) === 'natural' && !isAnyOtherFieldFilled(ctx, path.naturalPerson.firstname)
        });
    });

    private readonly atLeastOneWithValidateTreeSchema = schema<HierarchicFormModel>((path) => {
        validateTree(path, (ctx) => {
            // Resolve selector functions into concrete, root-bound schema paths.
            // After this line, we have the actual paths we want to validate.
            const selectedPaths = [
                path.naturalPerson.firstname,
                path.naturalPerson.birthYear,
                path.naturalPerson.lastname,

                path.legalPerson.legalForm,
                path.legalPerson.revenue,
                path.legalPerson.companyName,
                path.legalPerson.employeeCount,

                path.contact.phone,
                path.contact.email,
                path.contact.address.zip,
                path.contact.address.street,
                path.contact.address.number,
            ];

            // Check if at least one of the selected fields is "filled".
            // We read each value via ctx.valueOf(...) and apply the isFilled logic.
            const anyFilled = selectedPaths.some((selectedPath) => !!ctx.valueOf(selectedPath));

            // If at least one field is filled, validation passes → no error
            if (anyFilled) {
                return null;
            }

            return {
                kind: 'atLeastOneRequired',
                message: 'At least on criteria is required',
                // Resolve the target field path and attach the error to its FieldTree
                fieldTree: ctx.fieldTreeOf(path.contact.phone),
            };
        });
    })

    private readonly atLeastOneWithValidatorSchema = schema<HierarchicFormModel>((path) => {
        atLeastOne(path, [
            p => p.naturalPerson.firstname,
            p => p.naturalPerson.lastname,
            p => p.naturalPerson.birthYear,

            p => p.legalPerson.legalForm,
            p => p.legalPerson.revenue,
            p => p.legalPerson.companyName,
            p => p.legalPerson.employeeCount,

            p => p.contact.phone,
            p => p.contact.email,
            p => p.contact.address.zip,
            p => p.contact.address.number,
            p => p.contact.address.street,
        ], p => p.contact.phone)
    })

    private readonly appSchema = schema<HierarchicFormModel>((path) => {
        // Conditionally include person validation
        applyWhen(path.naturalPerson, not(valueEquals(path.type, 'natural')), inactive);
        applyWhen(path.legalPerson, not(valueEquals(path.type, 'legal')), inactive);

        /**
         * Way 1: based on `required`. simple, but works with two or three fields
         */
        applyWhen(path, () => this.schemaDefinition() === 'WAY1', this.needPhoneWhenNoOtherFieldIsFilled)

        /**
         * Way 2: more complex but still based on `required`, but works with any number of fields
         * This attempt will add `*` (required) mark on all form fields => but only on is really required ?!?.
         */
        applyWhen(path, () => this.schemaDefinition() === 'WAY2', this.atLeastOneCriteriaSchema)

        /**
         * Way 3: based on validateTree, less complex extendable in a more expressive way.
         * It won't add `*` (required) mark on all form fields.
         */
        applyWhen(path, () => this.schemaDefinition() === 'WAY3', this.atLeastOneWithValidateTreeSchema)

        /**
         * Way 4: base on validateTree. Extracted as a validator, it can be reused.
         */
        applyWhen(path, () => this.schemaDefinition() === 'WAY4', this.atLeastOneWithValidatorSchema)

        /**
         * Way 5: Extracted validator, recursively inspecting all fields.
         */
        applyWhen(path, () => this.schemaDefinition() === 'WAY5', (p) => requiredAtLeastOne(p, { exclude: [p => p.type] }))
    });

    /**
     * Initialization of the form with initial values and schema.
     */
    protected readonly contactForm = form(signal<HierarchicFormModel>(this.contactModel), this.appSchema);
}
