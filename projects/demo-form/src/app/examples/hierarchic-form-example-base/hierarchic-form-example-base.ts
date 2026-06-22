import {Component, input} from '@angular/core';
import {InputFormField} from '../../../shared/components/input-form-field';
import {SelectFormField} from '../../../shared/components/select-form-field';
import {ButtonToggleFormField} from '../../../shared/components/button-toggle-form-field';
import {FieldTree} from '@angular/forms/signals';
import {LEGAL_FORM_OPTIONS, PERSON_TYPE_OPTIONS} from '../../contact-model';
import {HierarchicFormModel} from '../hierarchic-model-example';

@Component({
    selector: 'app-hierarchic-form-example-base',
    imports: [
        InputFormField,
        SelectFormField,
        ButtonToggleFormField
    ],
    template: `
            <app-button-toggle-form-field
                label="Person Type"
                [fieldTree]="contactForm().type"
                [options]="PERSON_TYPE_OPTIONS"
            />

            <div class="border-t pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <app-input-form-field
                        label="First Name"
                        [fieldTree]="contactForm().naturalPerson.firstname"
                        placeholder="Max"
                    />

                    <app-input-form-field
                        label="Last Name"
                        [fieldTree]="contactForm().naturalPerson.lastname"
                        placeholder="Mustermann"
                    />

                    <app-input-form-field
                        class="col-span-1 md:col-span-2"
                        label="Birth Year"
                        placeholder="1990"
                        [fieldTree]="contactForm().naturalPerson.birthYear"
                    />

                    <app-input-form-field
                        class="col-span-1 md:col-span-2"
                        label="Company Name"
                        placeholder="Muster GmbH"
                        [fieldTree]="contactForm().legalPerson.companyName"
                    />

                    <app-select-form-field
                        class="col-span-1 md:col-span-2"
                        label="Legal Form"
                        [options]="LEGAL_FORM_OPTIONS"
                        [fieldTree]="contactForm().legalPerson.legalForm"
                    />

                    <app-input-form-field
                        label="Number of Employees"
                        [fieldTree]="contactForm().legalPerson.employeeCount"
                        placeholder="50"
                    />

                    <app-input-form-field
                        label="Annual Revenue (€)"
                        [fieldTree]="contactForm().legalPerson.revenue"
                        placeholder="1.000.000,00"
                    />
                </div>
            </div>

            <section class="border-t pt-4 flex flex-col gap-4">
                <h2 class="text-xl font-semibold text-cyan-800">Contact Details</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <app-input-form-field
                        label="Phone Number"
                        [fieldTree]="contactForm().contact.phone"
                        placeholder="+49 123 456789"
                    />

                    <app-input-form-field
                        label="Email"
                        [fieldTree]="contactForm().contact.email"
                        placeholder="max@example.com"
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <app-input-form-field
                        label="ZIP Code"
                        [fieldTree]="contactForm().contact.address.zip"
                        placeholder="12345"
                    />

                    <app-input-form-field
                        class="md:col-span-1"
                        label="Street"
                        [fieldTree]="contactForm().contact.address.street"
                        placeholder="Main Street"
                    />

                    <app-input-form-field
                        label="House Number"
                        [fieldTree]="contactForm().contact.address.number"
                        placeholder="1a"
                    />
                </div>
            </section>

    `,
    styles: ``,
})
export class HierarchicFormExampleBase {

    /**
     * Initialization of the form with initial values and schema.
     */
    public readonly contactForm = input.required<FieldTree<HierarchicFormModel>>();

    protected readonly LEGAL_FORM_OPTIONS = LEGAL_FORM_OPTIONS;

    protected readonly PERSON_TYPE_OPTIONS = PERSON_TYPE_OPTIONS;
}
