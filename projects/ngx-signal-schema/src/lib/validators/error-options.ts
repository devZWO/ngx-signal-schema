import {ValidationError} from '@angular/forms/signals';

/**
 * Represents an error option containing error details.
 *
 * The `ErrorOption` type is designed to provide structured information
 * about errors. It includes the kind of error as a string identifier
 * and a message describing the error.
 *
 * This type is intended for scenarios where detailed error reporting
 * and categorization are required.
 *
 */
export interface ErrorOption {

    /**
     * Optional object containing error details.
     */
    error?: {
        /**
         * The kind of error as a string identifier.
         */
        kind?: string;
        /**
         * A message describing the error.
         */
        message?: string;
    };
}

/**
 * This type is used to add the options to the error,
 * so you can use the option configuration in the error message.
 *
 */
export interface ValidationErrorWith<T> extends ValidationError {
    options: T;
}
