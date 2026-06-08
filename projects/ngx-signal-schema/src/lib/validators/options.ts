/**
 * Represents an error option containing error details.
 *
 * The `ErrorOption` type is designed to provide structured information
 * about errors. It includes the kind of error as a string identifier
 * and a message describing the error.
 *
 * This type is intended for scenarios where detailed error reporting
 * and categorization are required.
 */
export interface ErrorOption {
    error?: { kind?: string; message?: string; }
}
