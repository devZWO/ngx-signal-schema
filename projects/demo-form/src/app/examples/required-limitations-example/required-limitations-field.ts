import {Component, signal} from '@angular/core';
import {form, required} from '@angular/forms/signals';
import {requiredDefined, requiredTrimmed, applyIf} from '@devzwo/ngx-signal-schema';
import {ErrorIndicator} from '../../../shared/components/error-indicator';
import {MatError} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {InputFormField} from '../../../shared/components/input-form-field';
import {ConfigBox} from '../../../shared/components/config-box';
import {MonoFont} from './mono-font/mono-font';

interface NamePublishingOptions {
    name: string;
    publish: boolean | null;
}

@Component({
    selector: 'app-required-limitations-example',
    imports: [ErrorIndicator, MatError, MatRadioGroup, MatRadioButton, InputFormField, ConfigBox, MonoFont],
    template: `
        <section class="grid grid-cols-1 gap-6">
            <h1 class="heading-1">Limitations of default <mono>required</mono> validator </h1>

            <p class="text-gray-700">
                The standard <mono>required</mono> validator has limitations: it accepts whitespace-only strings as valid and treats <mono>false</mono> as invalid.
                This example demonstrates how <mono>requiredTrimmed</mono> ensures strings contain non-whitespace characters, and <mono>requiredDefined</mono> allows <mono>false</mono> while still requiring a value to be present.
            </p>

            <div class="grid grid-cols-1 gap-2">
                <h2 class="heading-2">NAME -
                    <mono>requiredTrimmed</mono>
                </h2>
                <app-config-box>
                    <div class="flex flex-col gap-2">
                        <mat-radio-group
                            aria-labelledby="name-validator-label"
                            [value]="nameValidatorType()"
                            (change)="nameValidatorType.set($event.value)"
                            class="grid grid-cols-2 gap-4"
                        >
                            <mat-radio-button value="required">Default (
                                <mono>required</mono>
                                )
                            </mat-radio-button>
                            <mat-radio-button value="requiredTrimmed">
                                <mono>requiredTrimmed</mono>
                            </mat-radio-button>
                        </mat-radio-group>
                    </div>
                </app-config-box>

                <app-input-form-field
                    label="Name"
                    [fieldTree]="exampleForm.name"
                    placeholder="<First Name> <Last Name>"
                />
            </div>


            <div class="grid grid-cols-1 gap-2">
                <h2 class="text-xl font-bold text-cyan-800">Publish - <mono>requiredDefined</mono></h2>
                <app-config-box>
                    <div class="flex flex-col gap-2">
                        <mat-radio-group
                            aria-labelledby="publish-validator-label"
                            [value]="publishValidatorType()"
                            (change)="publishValidatorType.set($event.value)"
                            class="grid grid-cols-2 gap-4"
                        >
                            <mat-radio-button value="required">Default (<mono>required</mono>)
                            </mat-radio-button>
                            <mat-radio-button value="requiredDefined"><mono>requiredDefined</mono>
                            </mat-radio-button>
                        </mat-radio-group>
                    </div>
                </app-config-box>

                <div class="flex flex-col gap-2">
                    <h3 id="publish-validator-label" class="text-sm font-medium text-gray-700">Publish</h3>
                    <mat-radio-group
                        [value]="exampleForm.publish().value()"
                        (change)="exampleForm.publish().value.set($event.value)"
                    >
                        <div class="grid grid-cols-3 gap-4">
                            <mat-radio-button [value]="true">Public (<mono>true</mono>)</mat-radio-button>
                            <mat-radio-button [value]="false">Private (<mono>false</mono>)</mat-radio-button>
                            <mat-radio-button [value]="null">dont know (<mono>null</mono>)</mat-radio-button>
                        </div>

                    </mat-radio-group>
                    <mat-error appErrorIndicator [fieldState]="exampleForm.publish()"/>
                </div>
            </div>

            <button [disabled]="exampleForm().invalid()">Submit</button>
        </section>
    `,
})
export class RequiredExtendedExample {

    protected readonly nameValidatorType = signal<'required' | 'requiredTrimmed'>('required');
    protected readonly publishValidatorType = signal<'required' | 'requiredDefined'>('required');

    protected readonly model = signal<NamePublishingOptions>({
        name: '',
        publish: null,
    });

    protected readonly exampleForm = form(this.model, (fieldPath) => {
        applyIf(
            fieldPath.name,
            () => this.nameValidatorType() === 'required',
            (path) => required(path, {message: 'Name is required'}),
            (path) => requiredTrimmed(path, {error: {message: 'Name is required'}})
        );

        applyIf(
            fieldPath.publish,
            () => this.publishValidatorType() === 'required',
            (path) => required(path, {message: 'Publishing option is required'}),
            (path) => requiredDefined(path, {error: {message: 'Publishing option is required'}})
        );
    });
}
