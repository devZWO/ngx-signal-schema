import {apply, schema} from '@angular/forms/signals';
import {decimal, integer, requiredAtLeastOne, requiredIfOtherFilled, requiredTrimmed, year} from '@devzwo/ngx-signal-schema';

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

export interface LegalPerson {
    companyName: string;
    legalForm: string;
    employeeCount: string;
    revenue: string;
}


// --- Schema Definition ---

export const naturalPersonSchema = schema<NaturalPerson>((path) => {
    requiredTrimmed(path.firstname, {error: {message: 'First name is required'}});
    requiredTrimmed(path.lastname, {error: {message: 'Last name is required'}});
    year(path.birthYear, {error: {message: "Valid year required (4 digits)"}});
});

export const legalPersonSchema = schema<LegalPerson>((path) => {
    requiredTrimmed(path.companyName, {error: {message: 'Company name is required'}});
    requiredTrimmed(path.legalForm, {error: {message: 'Legal form is required'}});
    integer(path.employeeCount, {maxDigits: 6, error: {message: 'Maximum 6-digit integer'}});
    decimal(path.revenue, {maxIntegerDigits: 9, maxFractionDigits: 2, error: {message: 'Invalid format (max. 9 digits before and 2 after decimal point)'}});
});

export const addressSchema = schema<Address>((path) => {

    // If zip is filled -> street and number required
    requiredIfOtherFilled(path, a => a.zip, a => a.street, {error: {message: 'Street is required when ZIP code is provided'}});
    requiredIfOtherFilled(path, a => a.zip, a => a.number, {error: {message: 'House number is required when ZIP code is provided'}});

    // If street is filled -> zip and number required
    requiredIfOtherFilled(path, a => a.street, a => a.zip, {error: {message: 'ZIP code is required when street is provided'}});
    requiredIfOtherFilled(path, a => a.street, a => a.number, {error: {message: 'House number is required when street is provided'}});

    // If number is filled -> zip and street required
    requiredIfOtherFilled(path, a => a.number, a => a.zip, {error: {message: 'ZIP code is required when house number is provided'}});
    requiredIfOtherFilled(path, a => a.number, a => a.street, {error: {message: 'Street is required when house number is provided'}});
});

export const contactDataSchema = schema<ContactData>((path) => {
    apply(path.address, addressSchema);

    // At least phone or email must be provided
    requiredAtLeastOne(path, [
        p => p.phone,
        p => p.email
    ], {
        error: {
            message: 'Please provide a phone number or email address'
        }
    });
});

