import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {apply, form, schema} from '@angular/forms/signals';
import {ContactData, contactDataSchema, LegalPerson, legalPersonSchema, NaturalPerson, naturalPersonSchema, PersonType} from '../contact-model';
import {InputFormField} from '../../shared/components/input-form-field';
import {SelectFormField, SelectOption} from '../../shared/components/select-form-field';
import {ButtonToggleFormField, ButtonToggleOption} from '../../shared/components/button-toggle-form-field';
import {applyIf, compose, inactive, requiredDefined, valueEquals} from '@devzwo/ngx-signal-schema';


/**
 * The main interface for the form.
 * We combine the person properties into a flat person object
 * or keep them directly in the main interface, depending on preference.
 * Here we use a split into type, person and contact.
 */
export interface FlatFormModel {
    type: PersonType;
    person: NaturalPerson & LegalPerson;
    contact: ContactData;
}


export const naturalPersonHiddenSchema = schema<LegalPerson & NaturalPerson>(p => {
        inactive(p.birthYear)
        inactive(p.firstname)
        inactive(p.lastname)
    }
);
export const legalPersonHiddenSchema = schema<LegalPerson & NaturalPerson>(p => {
        inactive(p.companyName)
        inactive(p.legalForm)
        inactive(p.employeeCount)
        inactive(p.revenue)
    }
);

@Component({
    selector: 'app-flat-model-example',
    imports: [
        InputFormField,
        SelectFormField,
        ButtonToggleFormField
    ],
    template: `
        <section class="flex flex-col gap-6">
            <h1 class="text-3xl font-bold text-cyan-700">Registration (Flat Model)</h1>

            <app-button-toggle-form-field
                label="Person Type"
                [fieldTree]="contactForm.type"
                [options]="personTypeOptions"
            />

            <div class="border-t pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <app-input-form-field
                        label="First Name"
                        [fieldTree]="contactForm.person.firstname"
                        placeholder="Max"
                    />

                    <app-input-form-field
                        label="Last Name"
                        [fieldTree]="contactForm.person.lastname"
                        placeholder="Mustermann"
                    />

                    <app-input-form-field
                        class="col-span-1 md:col-span-2"
                        label="Birth Year"
                        placeholder="1990"
                        [fieldTree]="contactForm.person.birthYear"
                    />

                    <app-input-form-field
                        class="col-span-1 md:col-span-2"
                        label="Company Name"
                        placeholder="Muster GmbH"
                        [fieldTree]="contactForm.person.companyName"
                    />

                    <app-select-form-field
                        class="col-span-1 md:col-span-2"
                        label="Legal Form"
                        [options]="legalFormOptions"
                        [fieldTree]="contactForm.person.legalForm"
                    />

                    <app-input-form-field
                        label="Number of Employees"
                        [fieldTree]="contactForm.person.employeeCount"
                        placeholder="50"
                    />

                    <app-input-form-field
                        label="Annual Revenue (€)"
                        [fieldTree]="contactForm.person.revenue"
                        placeholder="1.000.000,00"
                    />
                </div>
            </div>

            <section class="border-t pt-4 flex flex-col gap-4">
                <h2 class="text-xl font-semibold text-cyan-800">Contact Details (At least one required)</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <app-input-form-field
                        label="Phone Number"
                        [fieldTree]="contactForm.contact.phone"
                        placeholder="+49 123 456789"
                    />

                    <app-input-form-field
                        label="Email"
                        [fieldTree]="contactForm.contact.email"
                        placeholder="max@example.com"
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <app-input-form-field
                        label="ZIP Code"
                        [fieldTree]="contactForm.contact.address.zip"
                        placeholder="12345"
                    />

                    <app-input-form-field
                        class="md:col-span-1"
                        label="Street"
                        [fieldTree]="contactForm.contact.address.street"
                        placeholder="Main Street"
                    />

                    <app-input-form-field
                        label="House Number"
                        [fieldTree]="contactForm.contact.address.number"
                        placeholder="1a"
                    />
                </div>
            </section>
        </section>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatModelExample {

    private readonly contactModel: FlatFormModel = {
        type: 'natural',
        person: {
            firstname: '',
            lastname: '',
            birthYear: '',
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

    protected readonly personTypeOptions: ButtonToggleOption[] = [
        {label: 'Natural Person', value: 'natural'},
        {label: 'Legal Person', value: 'legal'},
    ];

    protected readonly legalFormOptions: SelectOption[] = [
        {label: 'GmbH', value: 'GmbH'},
        {label: 'AG', value: 'AG'},
        {label: 'UG', value: 'UG'},
        {label: 'OHG', value: 'OHG'},
        {label: 'GbR', value: 'GbR'},
    ];

    private readonly appSchema = schema<FlatFormModel>((path) => {
        // Base type must be defined
        requiredDefined(path.type, {error: {message: 'Person type is required'}});

        // Include contact data (including address)
        apply(path.contact, contactDataSchema);

        // Conditionally include person validation
        applyIf(
            path.person,
            valueEquals(path.type, 'natural'),
            // compose validator with UI logic: disable/hide based on type
            // works with type inference
            compose(naturalPersonSchema, legalPersonHiddenSchema),
            compose(legalPersonSchema, naturalPersonHiddenSchema)
        );

    });

    /**
     * Initialization of the form with initial values and schema.
     */
    protected readonly contactForm = form(signal<FlatFormModel>(this.contactModel), this.appSchema);
}
