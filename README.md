# validate

Validate.js is an automatic javascript library to validate HTML form fields using data- HTML5 attributes.

##Example:

###HTML:

```html
<form id="myForm" data-validate="true">
  <div id="field1">
    <div class="form-group">
      <fieldset class="large">
        <label for="name">Your name</label>
        <input id="name" name="name" type="text" placeholder="type your name" 
               data-required="true" data-tovalidate="alfa" />
      </fieldset>
    </div>

    <div class="form-group">
      <fieldset class="large">
        <label for="mobile">mobile number</label>
        <input id="mobile" name="mobile" maxlength="9" type="text" placeholder="type your mobile number"
               data-required="true" data-tovalidate="movil" />
      </fieldset>
    </div>

    <div class="form-group">
      <fieldset class="large">
        <label for="email">tu email</label>
        <input id="email" name="email" type="text" placeholder="type your email"
               data-required="true" data-tovalidate="email" />
      </fieldset>
    </div>

    <div class="form-group">
      <fieldset class="large">
        <input id="accept" name="accept" type="checkbox"
               data-required="true" />
        <span>Accept conditions</span>
      </fieldset>
    </div>

    <div class="links">
      <button id="submitBtn" type="submit" class="btn btn-default" data-checkform="true">Submit</button>
    </div>
  </div>
</form>
```

###javascript
```javascript
  var val = new Validate();

  document.getElementById("myForm").addEventListener("submit", function(evt) {
    // For example my Ajax Code to send form
    alert( "FORM CORRECT. SENDING FORM...");
    return false;
  });
```
