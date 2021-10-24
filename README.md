# ValidateForm.js

ValidateForm.js is an automatic javascript class to validate HTML form fields using **data-** HTML5 attributes.
It has little more than 12Kb. Without dependencies, like jQuery, but compatible with them.

## Example:

- http://codepen.io/manufosela/pen/PqZdrq (Live Codepen)
- https://manufosela.es/Automatic-Form-Validation/index.html

## Simple Use

- First add in yout HTML

```html
<script type="module" src="ValidateForm.min.js"></script>
```

or

```html
<script>
  import { ValidateForm } from "./ValidateForm.min.js";
</script>
```

- Second, create object validateForm:

```html
<script>
  window.onload = function () {
    const validateForm = new ValidateForm();
  };
</script>
```

- Third add data-validate="true", and optionaly data-checkrealtime="true", to <form> tag:

```html
<form id="myForm" data-validate="true" data-checkrealtime="true">
  <!-- [...] -->
</form>
```

- Four add _data-_ attributes to form fields:

  - data-required="true" to mandatory fields
  - data-tovalidate="XXXX" to check the value with XXXX type

Example:

```html
<form id="myForm" data-validate="true">
  <input
    type="text"
    placeholder="type something.."
    data-required="true"
    data-tovalidate="alpha"
  />
</form>
```

ValidateForm.js automatically adds a red asterisk at the end on the tag <label>

## data-tovalidate types

ValidateForm.js can validate the next fields type:

- **int** or integer: integer numbers
- **float**: float numbers, numbers and .
- **number** or **numero**: numbers
- **alpha** or **alfa** or **text** or **texto**: text values, not numbers.
- **text-**: text values and -
- **alphaNumericSpace** or **textspace**: alphanumeric values with spaces, text and numbers with spaces
- **alphaNumeric** or **textnum**: alphanumeric values, text and numbers
- **email** or **correo**: email address
- **iccid**: integrated circuit card identifier
- **nummovil** or **movil** or **mobile**: Telephone number (mobile phone, not international phone)
- **numfijo** or **fijo** or **landphone**: Telephone number (land phone)
- **telefono** or **tel** or **telephone**: Telephone number (mobile or land phone)
- **cp** or **postalcode**: postal code
- **cuentabancaria** or **accountnumber**: account number
- **tarjetacredito** or **creditcard**: credit card
- **nif**: Número de Identificacion Fiscal in Spain
- **cif**: Código de Identificación Fiscal in Spain
- **nie**: Número de Identidad de Extranjero in Spain
- **fecha** or **date**: Date
- **noempty**: any value

You can use customize functions using fn:myFunction. You must define myFunction into a script tag previously.

## Complete Example:

```html
<form id="myForm" data-validate="true">
  <div class="form-group">
    <label for="name">Your name</label>
    <input
      id="name"
      name="name"
      type="text"
      placeholder="type your name"
      data-required="true"
      data-tovalidate="alfa"
    />
  </div>

  <div class="form-group">
    <label for="mobile">mobile number</label>
    <input
      id="mobile"
      name="mobile"
      maxlength="9"
      type="text"
      placeholder="type your mobile number"
      data-required="true"
      data-tovalidate="movil"
    />
  </div>

  <div class="form-group">
    <label for="email">Email</label>
    <input
      id="email"
      name="email"
      type="text"
      placeholder="type your email"
      data-required="true"
      data-tovalidate="email"
    />
  </div>

  <div class="form-group">
    <input id="accept" name="accept" type="checkbox" data-required="true" />
    <span>Accept conditions</span>
  </div>

  <div class="form-group">
    <label for="oddvalues">Type an odd value:</label>
    <input
      id="oddvalues"
      name="oddvalues"
      type="text"
      data-required="true"
      data-tovalidate="fn:checkOdd"
    />
  </div>

  <div class="links">
    <button
      id="submitBtn"
      type="submit"
      class="btn btn-default"
      data-checkform="true"
    >
      Submit
    </button>
  </div>
</form>

<script>
  function checkOdd(value) {
    return value % 2 == 0;
  }
</script>

<script type="module">
  import { ValidateForm } from "./ValidateForm.min.js";
  window.onload = function () {
    const validateForm = new ValidateForm();
  };
</script>
```

## Complex uses

### data-name attribute

Add a _data-name_ attribute to form fields extra label near of radio or checkbox fields, to show error message when these fields are wrong.
_data-name_ atribute has the value of the name of a radio o checkbox field marked to be checked.
When the named field has a wrong value it is marked instead of the radio or checkbox field.

```html
<div class="form-group">
  <label id="labelHasphone" data-name="hasphone"
    >Do you have a phone number?</label
  >
  <label for="hasphoneNO">
    <input
      id="hasphoneNO"
      name="hasphone"
      type="radio"
      data-required="true"
      value="nophone"
    />
    No
  </label>
  <label for="hasphoneYES">
    <input
      id="hasphoneYES"
      name="hasphone"
      type="radio"
      data-required="true"
      value="yesphone"
    />
    Yes
  </label>
</div>
```

### data-activate / data-deactivate and data-type=hiddenON

Add a _data-activate_ and _data-deactivate_ attributes to form fields to show fields when a value is select in referered data- value.

The fields with _data-activate/data-deactivate_ must be a data-type hiddenON and must have the attribute _type_, indicating the type of field to show when not hidden.

```html
<div class="form-group">
  <label id="labelHasphone" data-name="hasphone"
    >Do you have a phone number?</label
  >
  <label for="hasphoneNO">
    <input
      id="hasphoneNO"
      name="hasphone"
      type="radio"
      data-required="true"
      value="nophone"
    />
    No
  </label>
  <label for="hasphoneYES">
    <input
      id="hasphoneYES"
      name="hasphone"
      type="radio"
      data-required="true"
      value="yesphone"
    />
    Yes
  </label>
</div>

<fieldset data-activate="hasphoneYES" data-deactivate="hasphoneNO">
  <label for="phone">Phone number</label>
  <input
    id="phone"
    name="phone"
    data-type="hiddenON"
    type="text"
    data-required="true"
    data-tovalidate="telephone"
    placeholder="Your telephone number"
  />
</fieldset>
```

### data-checkrealtime

By default the value is true.
When a field lost the focus, this one is checked and a warning message is showed, if the value is not valid, in function to the value of data-tovalidate and data-required.
If you add the attribute _data-checkrealtime_ equal to false it avoids check the form when a field lost the focus.
The form is checked before the submit action, in that case, if any field is wrong this one will be checked when it lose the focus.
All fields/group fields need a label tag with correct for attribute to work correctly.
If the object from Validateform is created before to render de form, you can call `validateForm.checkFieldsToValidate();` to add validate functionality after
To use into a web-component you must define the _scope_ like webComponentName.shadowRoot.
