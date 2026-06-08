import {apply, schema} from '@angular/forms/signals';
import {decimal, disabledHidden, integer, requiredAtLeastOne, requiredIfOtherFilled, requiredTrimmed, year} from 'ngx-signal-schema';

// --- Interfaces ---

export type PersonType = 'natural' | 'legal';

export interface Address {
    zip: string;
    street: string;
    number: string;
}

export interface ContactData {
    phone: string;
    email: string;
    address: Address;
}

export interface NaturalPerson {
    firstname: string;
    lastname: string;
    birthYear: string;
}

export const naturalPersonHiddenSchema = schema<LegalPerson & NaturalPerson>(p => {
        disabledHidden(p.birthYear)
        disabledHidden(p.firstname)
        disabledHidden(p.lastname)
    }
);

export interface LegalPerson {
    companyName: string;
    legalForm: string;
    employeeCount: string;
    revenue: string;
}

export const legalPersonHiddenSchema = schema<LegalPerson & NaturalPerson>(p => {
        disabledHidden(p.companyName)
        disabledHidden(p.legalForm)
        disabledHidden(p.employeeCount)
        disabledHidden(p.revenue)
    }
);

/**
 * The main interface for the form.
 * We combine the person properties into a flat person object
 * or keep them directly in the main interface, depending on preference.
 * Here we use a split into type, person and contact.
 */
export interface AppFormModel {
    type: PersonType;
    person: NaturalPerson & LegalPerson;
    contact: ContactData;
}

// --- Schema Definition ---

export const naturalPersonSchema = schema<NaturalPerson>((path) => {
    requiredTrimmed(path.firstname);
    requiredTrimmed(path.lastname);
    year(path.birthYear); //TODO errorMessage="Valid year required (4 digits)"
});

export const legalPersonSchema = schema<LegalPerson>((path) => {
    requiredTrimmed(path.companyName);
    requiredTrimmed(path.legalForm);
    integer(path.employeeCount, {maxDigits: 6, message: 'Maximum 6-digit integer'});
    decimal(path.revenue, {maxIntegerDigits: 9, maxFractionDigits: 2, message: 'Invalid format (max. 9 digits before and 2 after decimal point)'});
});

export const addressSchema = schema<Address>((path) => {

    // If zip is filled -> street and number required
    requiredIfOtherFilled(path, a => a.zip, a => a.street, {message: 'Street is required when ZIP code is provided'});
    requiredIfOtherFilled(path, a => a.zip, a => a.number, {message: 'House number is required when ZIP code is provided'});

    // If street is filled -> zip and number required
    requiredIfOtherFilled(path, a => a.street, a => a.zip, {message: 'ZIP code is required when street is provided'});
    requiredIfOtherFilled(path, a => a.street, a => a.number, {message: 'House number is required when street is provided'});

    // If number is filled -> zip and street required
    requiredIfOtherFilled(path, a => a.number, a => a.zip, {message: 'ZIP code is required when house number is provided'});
    requiredIfOtherFilled(path, a => a.number, a => a.street, {message: 'Street is required when house number is provided'});
});

export const contactDataSchema = schema<ContactData>((path) => {
    apply(path.address, addressSchema);

    // At least phone or email must be provided
    requiredAtLeastOne(path, [
        p => p.phone,
        p => p.email
    ], {
        message: 'Please provide a phone number or email address'
    });
});

