import {Component, signal} from '@angular/core';
import {apply, form, schema} from '@angular/forms/signals';
import {ContactData, contactDataSchema, LegalPerson, legalPersonSchema, NaturalPerson, naturalPersonSchema, PersonType} from '../contact-model';
import {applyIf, inactive, requiredDefined, valueEquals} from '@devzwo/ngx-signal-schema';
import {HierarchicFormExampleBase} from './hierarchic-form-example-base/hierarchic-form-example-base';

export interface HierarchicFormModel {
    type: PersonType;
    naturalPerson: NaturalPerson;
    legalPerson: LegalPerson;
    contact: ContactData;
}


@Component({
    selector: 'app-hierarchic-model-example',
    imports: [
        HierarchicFormExampleBase
    ],
    template: `
        <section class="flex flex-col gap-6">
            <h1 class="text-3xl font-bold text-cyan-700">Registration (Hierarchic Model)</h1>

            <app-hierarchic-form-example-base [contactForm]="contactForm"/>

        </section>
    `,
})
export class HierarchicModelExample {

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

    private readonly appSchema = schema<HierarchicFormModel>((path) => {
        // Base type must be defined
        requiredDefined(path.type, {error: {message: 'Person type is required'}});

        // Include contact data (including address)
        apply(path.contact, contactDataSchema);

        // Conditionally include person validation
        applyIf(path.naturalPerson, valueEquals(path.type, 'natural'), naturalPersonSchema, inactive);
        applyIf(path.legalPerson, valueEquals(path.type, 'legal'), legalPersonSchema, inactive);

    });

    /**
     * Initialization of the form with initial values and schema.
     */
    protected readonly contactForm = form(signal<HierarchicFormModel>(this.contactModel), this.appSchema);
}
