# Valiform.js

Validate.js is an automatic javascript library to validate HTML form fields using data- HTML5 attributes. It has little more than 12Kb. Without dependencies, like jQuery, but compatible with them.

##Live Codepen Example:
[http://codepen.io/manufosela/pen/PqZdrq]

##Use 
Frist add in yout HTML
```javascript
<script type="text/javascript" src="valiform.min.js"></script>
```
Second add data-validate="true" to form tag

And thrid add *data-* attributes to form fields:
```html
data-required="true" to mandatory fields
data-tovalidate="XXXX" to check the value with XXXX type
```
For example:

```html
  <form id="myForm" data-validate="true">
    <input type="text" placeholder="type something.." data-required="true" data-tovalidate="alpha" />
     [...]
```
valiform.js automatically adds a red asterisk at the end on the tag <label>


##data-tovalidate types
Valiform.js can validate the next fields type:

* **int** or integer: integer numbers
* **float**: float numbers, numbers and .
* **number** or **numero**: numbers
* **alpha** or **alfa** or **text** or **texto**: text values, not numbers.
* **text-**: text values and -
* **alphaNumericSpace** or **textspace**: alphanumeric values with spaces, text and numbers with spaces
* **alphaNumeric** or **textnum**: alphanumeric values, text and numbers
* **email** or **correo**: email address
* **iccid**: integrated circuit card identifier
* **nummovil** or **movil** or **mobile**: Telephone number (mobile phone, not international phone)
* **numfijo** or **fijo** or **landphone**: Telephone number (land phone)
* **telefono** or **tel** or **telephone**: Telephone number (mobile or land phone)
* **cp** or **postalcode**: postal code
* **cuentabancaria** or **accountnumber**: account number
* **tarjetacredito** or **creditcard**: credit card
* **nif**: Número de Identificacion Fiscal in Spain
* **cif**: Código de Identificación Fiscal in Spain
* **nie**: Número de Identidad de Extranjero in Spain
* **fecha** or **date**: Date
* **noempty**: any value

##Code Example:

###HTML:

```html
<form id="myForm" data-validate="true">
  <div class="form-group">
    <label for="name">Your name</label>
    <input id="name" name="name" type="text" placeholder="type your name" data-required="true" data-tovalidate="alfa" />
  </div>

  <div class="form-group">
    <label for="mobile">mobile number</label>
    <input id="mobile" name="mobile" maxlength="9" type="text" placeholder="type your mobile number" data-required="true" data-tovalidate="movil" />
  </div>

  <div class="form-group">
    <label for="email">tu email</label>
    <input id="email" name="email" type="text" placeholder="type your email" data-required="true" data-tovalidate="email" />
  </div>

  <div class="form-group">
    <input id="accept" name="accept" type="checkbox" data-required="true" />
    <span>Accept conditions</span>
  </div>

  <div class="links">
    <button id="submitBtn" type="submit" class="btn btn-default" data-checkform="true">Submit</button>
  </div>

</form>
```

###javascript
```javascript
  var val = new Valiform();

  document.getElementById("myForm").addEventListener("submit", function(evt) {
    // For example my Ajax Code to send form
    alert( "FORM CORRECT. SENDING FORM...");
    return false;
  });
```
