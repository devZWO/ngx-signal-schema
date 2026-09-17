import {Component, signal} from '@angular/core';
import {form, required, FormField} from '@angular/forms/signals';
import {requiredDefined, requiredTrimmed, applyIf} from '@devzwo/ngx-signal-schema';

interface NamePublishingOptions {
  name: string;
  publish: boolean | null;
}

@Component({
  selector: 'app-simplified-required-limitations-example',
  imports: [FormField],
  template: `
      <section style="display: flex; flex-direction: column; gap: 24px;">
          <h1>Limitations of default required validator</h1>

          <p>
              The standard <code>required</code> validator has limitations: it accepts whitespace-only strings as valid and treats <code>false</code> as invalid.
              This example demonstrates how <code>requiredTrimmed</code> ensures strings contain non-whitespace characters, and <code>requiredDefined</code> allows <code>false</code> while still requiring a value to be present.
          </p>

          <div>
              <h2>NAME - requiredTrimmed</h2>
              <div class="validator-switch">
                  <label>
                      <input type="radio" name="name-validator" [checked]="nameValidatorType() === 'required'" (change)="nameValidatorType.set('required')"/>
                      Default (required)
                  </label>
                  <label>
                      <input type="radio" name="name-validator" [checked]="nameValidatorType() === 'requiredTrimmed'" (change)="nameValidatorType.set('requiredTrimmed')"/>
                      requiredTrimmed
                  </label>
              </div>

              <div class="field">
                  <div class="row">
                      <label for="name">Name</label>
                      <input id="name" [formField]="exampleForm.name" placeholder="<My Name>"/>
                  </div>
                  @if (exampleForm.name().errors(); as errors) {
                      <span class="error">{{ errors[0]?.message }}</span>
                  }
              </div>
          </div>

          <div>
              <h2>Publish - requiredDefined</h2>
              <div class="validator-switch">
                  <label>
                      <input type="radio" name="publish-validator" [checked]="publishValidatorType() === 'required'" (change)="publishValidatorType.set('required')"/>
                      Default (required)
                  </label>
                  <label>
                      <input type="radio" name="publish-validator" [checked]="publishValidatorType() === 'requiredDefined'" (change)="publishValidatorType.set('requiredDefined')"/>
                      requiredDefined
                  </label>
              </div>

              <div class="field">
                  <fieldset>
                      <legend>Publishing Option</legend>
                      <label>
                          <input type="radio" name="publish" [checked]="exampleForm.publish().value() === true" (change)="exampleForm.publish().value.set(true)"/>
                          Public (true)
                      </label>
                      <label>
                          <input type="radio" name="publish" [checked]="exampleForm.publish().value() === false" (change)="exampleForm.publish().value.set(false)"/>
                          Private (false)
                      </label>
                      <label>
                          <input type="radio" name="publish" [checked]="exampleForm.publish().value() === null" (change)="exampleForm.publish().value.set(null)"/>
                          don't know (null)
                      </label>
                  </fieldset>
                  @if (exampleForm.publish().errors(); as errors) {
                      <span class="error">{{ errors[0]?.message }}</span>
                  }
              </div>
          </div>

          <button [disabled]="exampleForm().invalid()">Submit</button>
      </section>
  `,
  styles: `
    .field { margin-top: 8px; margin-bottom: 16px; }
    .row { display: flex; gap: 8px; }
    .error { color: red; font-size: 12px; display: block; }
    fieldset { display: flex; gap: 12px; }
    .validator-switch { display: flex; gap: 16px; margin-bottom: 8px; padding: 8px; background: #f0f0f0; border-radius: 4px; }
  `
})
export class SimplifiedRequiredExtendedExample {

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
