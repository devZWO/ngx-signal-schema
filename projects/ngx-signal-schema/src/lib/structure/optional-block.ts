import {apply, applyWhen, Schema, schema, SchemaOrSchemaFn, SchemaPath} from "@angular/forms/signals";

/**
 * Represents an optional object block in a Signal Form.
 *
 * Angular Signal Forms can handle `null` values for primitive fields,
 * but optional object structures (form groups with nested fields) are
 * harder to model because the form tree requires an object to exist.
 *
 * `OptionalBlock` solves this by wrapping the actual domain data in a
 * stable container object. The form always works with a valid object
 * structure, while the `meta.enabled` flag controls whether the block
 * should be considered present or absent.
 *
 * This is especially useful for optional sections such as:
 *
 * - Billing address
 * - Alternative contact person
 * - Company information
 * - VAT details
 *
 * During form editing, the object always exists. During serialization,
 * disabled blocks can be treated as `null` or omitted entirely.
 *
 * @example
 * interface ContactForm {
 *   invoiceRecipient: OptionalBlock<InvoiceRecipient>;
 * }
 *
 * if (form.invoiceRecipient.meta.enabled) {
 *   // use invoiceRecipient.data
 * }
 *
 * @template T The wrapped domain model.
 * @template K The type of the enabled flag (defaults to boolean).
 *
 * @category Structure
 */
export interface OptionalBlock<T, K = boolean> {
    meta: { enabled: K }; // control logic (not Domain)
    data: T;              // domain logic (form always needs an Objekt)
}


/**
 * Type guard for OptionalBlock.
 * Checks if the given object matches the structure of an OptionalBlock.
 *
 * @param obj The object to check.
 * @returns True if the object is an OptionalBlock, false otherwise.
 *
 * @example
 * const maybeBlock: unknown = { meta: { enabled: true }, data: { id: 1 } };
 * if (isOptionalBlock<{ id: number }>(maybeBlock)) {
 *   // maybeBlock is now typed as OptionalBlock<{ id: number }>
 *   console.log(maybeBlock.data.id);
 * }
 *
 * @category Structure
 */
export function isOptionalBlock<T = unknown, K = boolean>(obj: unknown): obj is OptionalBlock<T, K> {
    // Check if it is a non-null object
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    // Cast to record for property access
    const candidate = obj as Record<string, unknown>;

    // Ensure 'meta' and 'data' properties are present
    if (!('meta' in candidate) || !('data' in candidate)) {
        return false;
    }

    // Validate the 'meta' property is an object
    const meta = candidate['meta'];
    if (typeof meta !== 'object' || meta === null) {
        return false;
    }

    // Ensure 'enabled' property exists within 'meta'
    return 'enabled' in meta;
}


/**
 * Maps an OptionalBlock to its data if it is enabled, otherwise returns null.
 * Useful for mapping form values back to domain models or DTOs.
 *
 * @param block The OptionalBlock to map.
 * @returns The data if enabled, null otherwise.
 *
 * @example
 * const block = { meta: { enabled: true }, data: { name: 'John' } };
 * const data = mapFromOptionalBlock(block); // { name: 'John' }
 *
 * const disabledBlock = { meta: { enabled: false }, data: { name: 'John' } };
 * const noData = mapFromOptionalBlock(disabledBlock); // null
 *
 * @category Structure
 */
export function mapFromOptionalBlock<T, R = boolean>(block: OptionalBlock<T, R>): T | null {
    return block.meta.enabled ? block.data : null;
}

/**
 * Creates an OptionalBlock from the given data and enabled state.
 * Useful for mapping domain models or DTOs to form values.
 *
 * @param data The data to wrap.
 * @param enabled Whether the block should be enabled by default. Defaults to true.
 * @returns An OptionalBlock containing the data and enabled state.
 *
 * @example
 * const block = mapToOptionalBlock({ name: 'John' });
 * // { meta: { enabled: true }, data: { name: 'John' } }
 *
 * @category Structure
 */
export function mapToOptionalBlock<T>(data: T, enabled = true): OptionalBlock<T> {
    return {
        meta: {enabled: enabled},
        data: data
    };
}


/**
 * Options for applying rules or schemas to an OptionalBlock.
 *
 * @template T The type of the data inside the block.
 * @template K The type of the enabled property in meta.
 *
 * @category Structure
 */
export interface ApplyOptionalOptions<T, K> {
    /**
     * Inline rules or schema applied to the `data` node when the block is considered enabled.
     */
    then: SchemaOrSchemaFn<T>;
    /**
     * Inline rules or schema applied to the `data` node when the block is considered disabled.
     */
    otherwise?: SchemaOrSchemaFn<T>;
    /**
     * A function to determine if the block is enabled based on the `meta.enabled` value.
     * Supports complex logic when `K` is not just a boolean.
     *
     * @param enabled The value of `meta.enabled`.
     * @returns True if the block should be treated as enabled.
     */
    isEnabled?: (enabled: K) => boolean;
}

function mapToOptions<T, K = boolean>(
    thenOrOptions: SchemaOrSchemaFn<T> | ApplyOptionalOptions<T, K>,
    otherwise?: SchemaOrSchemaFn<T>
): ApplyOptionalOptions<T, K> {
    // Determine if the first argument is an ApplyOptionalOptions configuration object.
    // We check for specific keys because Schema objects (returned by schema()) are also objects,
    // but they lack these properties.
    const isOptionsObject =
        typeof thenOrOptions === 'object' &&
        thenOrOptions !== null &&
        ('then' in thenOrOptions || 'otherwise' in thenOrOptions || 'isEnabled' in thenOrOptions) &&
        otherwise === undefined;

    if (isOptionsObject) {
        // Branch 1: The user provided a single configuration object.
        return thenOrOptions as ApplyOptionalOptions<T, K>;
    }

    // Branch 2: The user provided individual arguments (then-logic and optionally otherwise-logic).
    // We wrap these into the standard ApplyOptionalOptions structure.
    return {
        then: thenOrOptions as SchemaOrSchemaFn<T>,
        otherwise,
        isEnabled: (enabled: K) => Boolean(enabled),
    };
}

/**
 * Applies rules or a schema directly to the `data` node of a concrete `OptionalBlock` field.
 *
 * Use this inside an existing `schema(...)` when you already have a `SchemaPath`
 * to an `OptionalBlock<T>`.
 *
 * The `then` inline rules or schema are applied to `fieldPath.data` when
 * `meta.enabled` evaluates to `true`.
 *
 * If `otherwise` is provided, it is applied to `fieldPath.data` when
 * `meta.enabled` evaluates to `false`.
 *
 * @param fieldPath path to the concrete `OptionalBlock<T>` field.
 * @param then inline rules or schema applied when `meta.enabled` evaluates to `true`.
 * @param otherwise inline rules or schema applied when `meta.enabled` evaluates to `false`.
 *
 * @example
 * schema<MyModel>((fieldPath) => {
 *   applyOptional(fieldPath.someOptionalBlock, SomeSchema, disabledHidden);
 * });
 *
 * @category Structure
 */
export function applyOptional<T>(
    fieldPath: SchemaPath<OptionalBlock<T>>,
    then: SchemaOrSchemaFn<T>,
    otherwise?: SchemaOrSchemaFn<T>
): void;

// full overload
/**
 * Applies rules or a schema directly to the `data` node of a concrete `OptionalBlock` field.
 *
 * Use this overload when `meta.enabled` is not a boolean or when the enabled state
 * needs custom evaluation logic via `isEnabled`.
 *
 * This function does not create a reusable schema. It applies the optional-block
 * behavior immediately to the given `fieldPath`.
 *
 * @param fieldPath path to the concrete `OptionalBlock<T, K>` field.
 * @param options configuration for the rules and the enabled-state evaluation.
 *
 * @example
 * schema<MyModel>((fieldPath) => {
 *   applyOptional(fieldPath.statusBlock, {
 *     then: StatusActiveSchema,
 *     isEnabled: (status) => status === 'ACTIVE'
 *   });
 * });
 *
 * @category Structure
 */
export function applyOptional<T, K = boolean>(
    fieldPath: SchemaPath<OptionalBlock<T, K>>,
    options: ApplyOptionalOptions<T, K>
): void;

// implementation
export function applyOptional<T, K = boolean>(
    fieldPath: SchemaPath<OptionalBlock<T, K>>,
    thenOrOptions: SchemaOrSchemaFn<T> | ApplyOptionalOptions<T, K>,
    otherwise?: SchemaOrSchemaFn<T>
): void {
    applyOptionalImpl(fieldPath, mapToOptions<T, K>(thenOrOptions, otherwise));
}

function applyOptionalImpl<T, K = boolean>(
    fieldPath: SchemaPath<OptionalBlock<T, K>>,
    options: ApplyOptionalOptions<T, K>,
): void {
    const isEnabled = options.isEnabled ?? ((enabled: K) => Boolean(enabled));

    const thenFn = options.then;
    const elseFn = options.otherwise;

    if (thenFn) {
        applyWhen(
            fieldPath,
            (node) => isEnabled(node.value().meta.enabled),
            (node) => apply(node.data as SchemaPath<T>, thenFn)
        )
    }

    if (elseFn) {
        applyWhen(
            fieldPath,
            (node) => !isEnabled(node.value().meta.enabled),
            (node) => apply(node.data as SchemaPath<T>, elseFn)
        );
    }

}

/**
 * Creates a reusable schema for `OptionalBlock<T>`.
 *
 * Use this when an API expects a `Schema<OptionalBlock<T>>`, for example in
 * `form(...)`, `apply(...)`, or when composing reusable schemas.
 *
 * Internally this applies the same optional-block behavior as `applyOptional`,
 * but instead of applying it immediately to an existing `fieldPath`, it returns
 * a schema that can be applied later.
 *
 * The `then` inline rules or schema are applied to the block's `data` node when
 * `meta.enabled` evaluates to `true`.
 *
 * If `otherwise` is provided, it is applied to the block's `data` node when
 * `meta.enabled` evaluates to `false`.
 *
 * @param then inline rules or schema applied when `meta.enabled` evaluates to `true`.
 * @param otherwise inline rules or schema applied when `meta.enabled` evaluates to `false`.
 * @returns a reusable schema for an `OptionalBlock<T>`.
 *
 * @example
 * form(myOptionalBlockSignal, optionalBlock(SomeSchema, disabledHidden));
 *
 * @category Structure
 */
export function optionalBlock<T>(
    then: SchemaOrSchemaFn<T>,
    otherwise?: SchemaOrSchemaFn<T>
): Schema<OptionalBlock<T>>;

/**
 * Creates a reusable schema for `OptionalBlock<T, K>`.
 *
 * Use this overload when `meta.enabled` is not a boolean or when the enabled state
 * needs custom evaluation logic via `isEnabled`.
 *
 * This returns a schema. It does not apply rules to a concrete field immediately.
 * If you already have a `SchemaPath` inside an existing `schema(...)`, prefer
 * `applyOptional(...)`.
 *
 * @param options configuration for the rules and the enabled-state evaluation.
 * @returns a reusable schema for an `OptionalBlock<T, K>`.
 *
 * @example
 * const mySchema = optionalBlock({
 *   then: SomeSchema,
 *   otherwise: OtherSchema,
 *   isEnabled: (val) => val === 'yes'
 * });
 *
 * @category Structure
 */
export function optionalBlock<T, K = boolean>(
    options: ApplyOptionalOptions<T, K>
): Schema<OptionalBlock<T, K>>;

export function optionalBlock<T, K = boolean>(
    thenOrOptions: SchemaOrSchemaFn<T> | ApplyOptionalOptions<T, K>,
    otherwise?: SchemaOrSchemaFn<T>
): Schema<OptionalBlock<T, K>> {
    return schema<OptionalBlock<T, K>>((fieldPath) => {
        applyOptionalImpl(fieldPath, mapToOptions<T, K>(thenOrOptions, otherwise))
    });
}
