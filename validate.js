/* validate.js library by @manufosela - 2015 */
/* works IE8+, FF, Chrome */
/* MIT License (MIT) Copyright (c) 2015 @manufosela */
/* It is independent of any library or framework */
var Validate = (function(){

  'use strict';
  
  Validate = function() {
    this.badvalue = 0;
    this.warningColor = "#F60";

    var _this = this,
        dVld = document.querySelectorAll( "form[data-validate=true]" ),
        dChk, i = 0, lI = dVld.length, j = 0, lJ, ok,
        _beforeSubmit = function( e ) {
          if( e.preventDefault ) { e.preventDefault(); e.stopPropagation(); } else { e.returnValue = false; }
          e = e || window.event;
          var target = e.target || e.srcElement,
              f = target.formParam;
          if ( _this.noEmptyFields() ) { ok = true; }
          if ( _this.validateFields() ){ ok = ok && true; }
          if ( ok ) { _this._triggerEvent( f, "submit" ); }
          return false;
        };
    for( ; i<lI; i++ ) {    
      this.markRequiredFields( dVld[i] );
      this.checkFieldsRealTime( dVld[i] );
      dChk = dVld[i].querySelectorAll( "[type=submit][data-checkform=true]" );
      lJ = dChk.length; ok = false;
      for ( ; j<lJ; j++ ) {
        var submitBtn = dChk[j];
        submitBtn.formParam = dVld[i];
        this._on( submitBtn, "click", _beforeSubmit);
      }
    }
  };
  Validate.prototype.validate = function( val, type ) {
    if ( val === "" && val === null && type != "noempty" ) { return true; }
    switch( type ) {
      case "int":
      case "integer":
        return this.isInt( val );
      case "float":
        return this.isFloat( val );
      case "number":
      case "numero":
        return this.isNumber( val );  // integer o float
      case "alpha":
      case "alfa":
      case "text":
      case "texto":
        return this.isAlpha( val );
      case "text-":
        return this.isAlphaGuion( val );
      case "alphaNumericSpace":
      case "textspace":
        return this.isAlphaNumericSpace( val );
      case "alphaNumeric":
      case "textnum":
        return this.isAlphaNumeric( val );
      case "email":
        return this.isEmail( val );
      case "iccid":
        return this.checkICCID( val );
      case "nummovil":
      case "movil":
        return this.checkNumMovil( val );
      case "numfijo":
      case "fijo":
        return this.checkNumFijo( val );
      case "telefono":
      case "tel": // fijo o movil
        return this.checkTelephoneNumber( val );
      case "cp":
        return this.checkCodPostal( val );
      case "cuentabancaria":
        return this.verificaCuentaBancaria( val );
      case "tarjetacredito":
        return this.verificaNumTarjetaCredito( val );
      case "nif":
      case "cif":
      case "nie":
        return valida_nif_cif_nie( val );
      case "fecha":
        return isDate( val, "dmy" );
      case "selected":
      case "noempty":
        return ( val!=="" );
      case "checked":
        return ( $( this ).prop( "checked" ) == "true" );
    }
    return false;
  };

  Validate.prototype.isInt = function( val ){
    return ( val == parseInt( val ) );
  };
  Validate.prototype.isFloat = function( val ){
    return ( val == parseFloat( val ) );
  };
  Validate.prototype.isNumber = function( val ){
    var regexp = /^[0-9\.]+$/;
    return regexp.test( val );
  };
  Validate.prototype.isEmail = function( email ) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test( email );
  };
  Validate.prototype.verificaCuentaBancaria = function( numcuenta ) {
    var parte1 = "00" + numcuenta.substr( 0, 8),
        control = numcuenta.substr( 8, 2 ),
        parte2 = numcuenta.substr( 10 ),
        pesos = new Array(1, 2, 4, 8, 5, 10, 9, 7, 3, 6),
        d1 = 0, d2 = 0,
        i = 0;
    for ( ; i<=9; i++ ) { d1 += parseInt( parte1.charAt( i ) ) * pesos[i]; }
    d1 = 11 - ( d1 % 11 );
    if ( d1 == 11 ) { d1=0; }
    if ( d1 == 10 ) { d1=1; }
    i = 0;
    for ( ; i<=9; i++ ) { d2 += parseInt( parte2.charAt( i ) ) * pesos[i]; }
    d2 = 11 - ( d2 % 11 );
    if ( d2 == 11 ) { d2=0; }
    if ( d2 == 10 ) { d2=1; }
    return ( ( d1.toString() + d2.toString() ) == control );
  };

  Validate.prototype.verificaNumTarjetaCredito = function( numtarjeta ) {
    var result = false, 
        firstDigitCorrect = ( numtarjeta[0] == 3 || numtarjeta[0] == 4 || numtarjeta[0] == 5 || numtarjeta[0] == 6 );
    if ( numtarjeta.length == 16 && firstDigitCorrect ) {
      result = ( this._getCtrlNumberCreditCard( numtarjeta ) == numtarjeta[15] );
    }
    return result;
  };

  Validate.prototype._getCtrlNumberCreditCard = function( numtarjeta ) {
    var suma=0, x, y;
    for( x=1; x<16; x++ ){
      if ( x/2 !== parseInt( x/2) ) {
        y = parseInt( numtarjeta[x-1] ) * 2;
        if ( y >= 10 ) {
          y -= 9;
        }
      } else {
        y = parseInt( numtarjeta[x-1] );
      }
      suma += y;
    }
    suma = 10 - (suma % 10);
    if ( suma === 10 ) {
      suma=0;
    }
    return suma;
  };
  Validate.prototype.isAlpha = function( val ) {
    var regexp = /^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñ\']+$/;
    var a = regexp.test( val );
    return a;
  };
  Validate.prototype.isAlphaGuion = function( val ) {
    var regexp = /^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñ\'\-]+$/;
    var a = regexp.test( val );
    return a;
  };
  Validate.prototype.isAlphaNumeric = function( val ){
    var regexp = /^[0-9A-Za-záéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñ\']+$/;
    var a = regexp.test( val );
    return a;  
  };
  Validate.prototype.isAlphaNumericSpace = function ( val ) {
    var regexp = /^[0-9A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñ\']+$/;
    var a = regexp.test( val );
    return a;
  };
  Validate.prototype.isDate = function( txtDate, mode ) {
    var currVal = txtDate;
    if(currVal === '') { return false; }
    //Declare Regex 
    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    var dtArray = currVal.match( rxDatePattern ); // is format OK?
    if (dtArray === null) { return false; }
    //Checks for dd/mm/yyyy format.
    switch ( mode ){
      case "mdy":
        dtMonth = dtArray[1];
        dtDay= dtArray[3];
        dtYear = dtArray[5];
        break;
      case "ymd":
        dtYear = dtArray[1];
        dtMonth = dtArray[5];
        dtDay= dtArray[7];
        break;
      default: // dmy
        dtDay= dtArray[1];
        dtMonth = dtArray[3];
        dtYear = dtArray[5];
        break;
    }
    if ( dtMonth < 1 || dtMonth > 12 ) { return false; }
    else if ( dtDay < 1 || dtDay> 31 ) { return false; }
    else if ( ( dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31 ) { return false; }
    else if ( dtMonth == 2 ) {
      var isleap = ( dtYear % 4 === 0 && ( dtYear % 100 !== 0 || dtYear % 400 === 0 ) );
      if ( dtDay> 29 || ( dtDay ==29 && !isleap ) ) { return false; }
    }
    return true;
  };
  Validate.prototype.checkNumMovil = function ( val ) {
    var patron = /^[67]\d{8}$/;
    var expReg = new RegExp( patron );
    return ( expReg.test( val ) )?1:0;
  };
  Validate.prototype.checkNumFijo = function ( val ) {
    var patron = /^[89]\d{8}$/;
    var expReg = new RegExp( patron );
    return ( expReg.test( val ) )?1:0;
  };
  Validate.prototype.checkTelephoneNumber = function ( val ) {
    return ( !this.checkNumFijo( val ) && !this.checkNumMovil( val ) )?-2:1;
  };
  Validate.prototype.checkCodPostal = function ( val ) {
    return ( val.length == 5 && this.isInt( val ) );
  };
  Validate.prototype.checkICCID = function ( Luhn ) {
    var LuhnDigit = parseInt( Luhn.substring( Luhn.length-1, Luhn.length ) ),
        LuhnLess = Luhn.substring( 0, Luhn.length-1 );
    if ( Luhn.substring(0,2) != "89" ) { return 0; }
    if ( this._CalculateLuhn( LuhnLess )==parseInt( LuhnDigit ) ) {
      if ( Luhn.length == 19 || Luhn.length == 20 ) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  };
  Validate.prototype._CalculateLuhn = function ( Luhn ) {
    var sum = 0;
    for ( i=0; i<Luhn.length; i++ ) {
      sum += parseInt( Luhn.substring( i, i+1 ) );
    }
    var delta = new Array ( 0,1,2,3,4,-4,-3,-2,-1,0 );
    for ( i=Luhn.length-1; i>=0; i-=2 ) {
      var deltaIndex = parseInt( Luhn.substring( i, i+1 ) );
      var deltaValue = delta[deltaIndex];
      sum += deltaValue;
    }
    var mod10 = sum % 10;
    mod10 = 10 - mod10;
    if ( mod10 == 10 ) {
      mod10=0;
    }
    return mod10;
   };

  Validate.prototype.calcDigitoControl2LineaNIF = function( s ) {
    var m = [ 7, 3, 1],
        i = 0, n = 0,
        l = s.length;
    for( ; i<l; i++ ) {
      n += s[i] * m[i % 3];
    }
    return n % 10;
  };

  Validate.prototype._getLetraNIF = function( dni ) {
    var cadenadni = "TRWAGMYFPDXBNJZSQVHLCKE", 
        posicion = dni % 23,
        letra = cadenadni.charAt( posicion );
    return letra;
  };

  Validate.prototype.valida_nif_cif_nie = function( a ) {
    var temp = a.toUpperCase(), temp1, temp2, i, n, pos,
        cadenadni = "TRWAGMYFPDXBNJZSQVHLCKE", posicion, letra, letradni, suma;
    if ( $( "#documento_de_identidad" ).val() == "PASAPORTE" ) { return 1; }
    if( temp !== '' ) {
      // ANTES DE - _ \s  !/^[A-Z]{1}[\s-_]?[0-9]{7}[\s-_]?[A-Z0-9]{1}$/
      if( ( !/^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$/.test( temp ) && !/^[T]{1}[A-Z0-9]{8}$/.test( temp ) ) && !/^[0-9]{8}[A-Z]{1}$/.test( temp ) ) {
        return 0; //si no tiene un formato valido devuelve error
      }
      //comprobacion de NIFs estandar
      if( /^[0-9]{8}[A-Z]{1}$/.test( temp ) ) {
        posicion = a.substring( 8, 0 ) % 23;
        letra = cadenadni.charAt( posicion );
        letradni = temp.charAt( 8 );
        if( letra == letradni ) { return 1; }
        else { return -1; }
      }
      //algoritmo para comprobacion de codigos tipo CIF
      suma = parseInt( a.charAt( 2 ) )+parseInt( a.charAt( 4 ) )+parseInt( a.charAt( 6 ) );
      for( i = 1; i < 8; i += 2 ) {
        temp1 = 2 * parseInt( a.charAt( i ) );
        temp1 += '';
        temp1 = temp1.substring(0,1);
        temp2 = 2 * parseInt( a.charAt( i ) );
        temp2 += '';
        temp2 = temp2.substring( 1,2 );
        if( temp2 === '' ) { temp2 = '0'; }
        suma += ( parseInt( temp1 ) + parseInt( temp2 ) );
      }
      suma += '';
      n = 10 - parseInt( suma.substring( suma.length-1, suma.length ) );
      //comprobacion de NIFs especiales (se calculan como CIFs)
      if( /^[KLM]{1}/.test( temp ) ) {
        if( a.charAt( 8 ) == String.fromCharCode( 64 + n ) ) { return 1; }
        else { return -1; }
      }
      //comprobacion de CIFs
      if( /^[ABCDEFGHJNPQRSUVW]{1}/.test( temp ) ) {
        temp = n + '';
        if( a.charAt( 8 ) == String.fromCharCode( 64 + n ) ||
            a.charAt( 8 ) == parseInt( temp.substring( temp.length-1, temp.length ) ) ) { return 2; }
        else { return -2; }
      }
      //comprobacion de NIEs
      //T
      if( /^[T]{1}[A-Z0-9]{8}$/.test( temp ) ) {
        if( a.charAt( 8 ) == /^[T]{1}[A-Z0-9]{8}$/.test( temp ) ) { return 3; }
        else { return -3; }
      }
      //XYZ
      if( /^[XYZ]{1}/.test( temp ) ) {
        temp = temp.replace( 'X','0' );
        temp = temp.replace( 'Y','1' );
        temp = temp.replace( 'Z','2' );
        pos = temp.substring(0, 8) % 23;
        if( a.toUpperCase().charAt( 8 ) == cadenadni.substring( pos, pos + 1 ) ) { return 3; }
        else { return -3; }
      }
    }
    return 0;
  };

/**** FORM METHODS  *********/
  Validate.prototype.cleanMsgError = function( htmlId ) {
    if ( !!~htmlId.indexOf( "fn_" ) ) { htmlId = 'fec_nac'; }
    $( "#"+htmlId+"_msgError_Layer" ).html ( "" );
    $( "#"+htmlId ).css( { "border-color": "#333" } );
  };

  Validate.prototype.appendHtml = function( el, htmlId, msgError, border ) {
    if ( typeof msgError != "undefined" ) {
      if ( typeof border == "undefined" ) { border = true; }
      if ( $( "#"+htmlId+"_msgError_Layer" ).length === 0 ) {
        var htmlMsgError = "<span class='error' id='"+htmlId+"_msgError_Layer'>&nbsp;&nbsp;" + msgError + "</span>";
        el.append( htmlMsgError );
      } else {
        $( "#"+htmlId+"_msgError_Layer" ).html( msgError );
      }
      if ( border ) { $( "#"+htmlId ).css( { "border": "1px solid #F00" } ); }
    }
  };

  Validate.prototype.restoreErrorLayer = function( htmlId ) {
    if ( $( "#"+htmlId+"_msgError_Layer" ).length !== 0 ) {
      $( "#"+htmlId+"_msgError_Layer" ).remove();
      $( "#"+htmlId ).css( { "border": "1px solid #CCC" } );
    }
  };

  // Put a span with a * in form fields with attribute data-required=true
  // Is mandatory to have a label tag to append span tag into the label tag
  Validate.prototype.markRequiredFields = function( f, html ) {
    if ( typeof f === "undefined" ) { return false; }
    html = ( typeof html !== "undefined" )? html:"*";
    var _this = this,
        aEl = f.querySelectorAll("[data-required=true]" ),
        i = 0, l = aEl.length,
        asterisco, sb;
    for( ; i<l; i++ ) {
      asterisco = document.createElement( "span" );
      asterisco.className="asterisco";
      asterisco.innerHTML=html;
      sb = _this._getAllSiblings( aEl[i], "LABEL" );
      sb[0].appendChild( asterisco );
    }
  };
  Validate.prototype.validateFields = function(){
    this.badvalue=0;
    var _this=this,
        aEl = document.querySelectorAll( "[data-tovalidate]" ),
        val, type,
        i = 0, l = aEl.length;
    for( ; i<l; i++ ) {
      val = aEl[i].getAttribute( "value" ) || aEl[i].value || "";
      type = aEl[i].getAttribute( "data-tovalidate" ) || "";
      if ( !_this.validate( val, type ) ) { this.badValue++; }
    }
    return ( this.badvalue===0 );
  };
  Validate.prototype.noEmptyFields = function(){
    var _this = this,
        empty=0,
        aEl = document.querySelectorAll( "[data-required=true]" ),
        val, typeF,
        i = 0, l = aEl.length;
    for( ; i<l; i++ ) {
      val = aEl[i].getAttribute( "value" ) || aEl[i].value || "";
      typeF = aEl[i].getAttribute( "type" ) || aEl[i].type || "";
      if ( typeF == "radiobutton" || typeF == "checkbox" ) {
        if ( !aEl[i].checked ) {
          _this.addWarnMesg( aEl[i], "campo requerido" );
        }
      } else if ( val === "" ) { 
        _this.addWarnMesg( aEl[i], "campo requerido" );
        empty++; 
      }
    }
    return ( empty===0 );
  };
  Validate.prototype.addWarnMesg = function( el, msg ) {
    var warning = document.createElement( "p" ),
        target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement,
        name= target.getAttribute( "name" ),
        id = "warning-"+name;
      if ( !document.getElementById( id ) ) {
        el = document.getElementById( target.getAttribute( "id" ) || el.id );
        warning.className="text-warning";
        warning.id=id;
        warning.innerHTML=msg;        
        el.parentElement.appendChild( warning );
        el.setAttribute( "style", "border:2px solid "+this.warningColor+"!important;" );
      }
  };
  Validate.prototype.delWarnMesg = function( el ) {
    var target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement,
        name= target.getAttribute( "name" ) || "";
    if ( document.getElementById( "warning-"+name ) ) {
      target.parentElement.removeChild( document.getElementById( "warning-"+name ) );
    }
    //this.removeClass( el, "warningField" );
    this.removeStyle( el );
  };
  Validate.prototype.hasClass = function( el, cls ) {
    var regexp = new RegExp( '(\\s|^)' + cls + '(\\s|$)' ),
        target = ( typeof el.className == "undefined" )?window.event.srcElement:el;
    return target.className.match( regexp );
  };
  Validate.prototype.addClass = function( el, cls ){
    if( !this.hasClass( el, cls ) ) {
      var target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement,
          spc = ( target.className !== "" )?" ":"";
      target.className+=spc+cls;
    }
  };
  Validate.prototype.removeClass = function( el, cls ) {
    if( this.hasClass( el, cls ) ) {
      var regexp = new RegExp( '(\\s|^)' + cls + '(\\s|$)' ),
          target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement;
      target.className=target.className.replace( regexp,"");
    }
  };
  Validate.prototype.removeStyle = function( el ) {
    var target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement;
    target.setAttribute( "style", "" );
  };
  Validate.prototype.checkFieldsRealTime = function( f ) {
    var _this = this,
        inputF = this._getArrayFromTag( f, "input" ),
        textareaF = this._getArrayFromTag( f, "textarea" ),
        selectF = this._getArrayFromTag( f, "select" ),
        fields = ( typeof textareaF != "undefined" )?inputF.concat( textareaF ):inputF,
        i = 0, l = fields.length, 
        el, re, ch, typeF,
        myfnblur = function( e ) {
          e = e || window.event;
          var target = e.target || e.srcElement,
              val = target.value || target.getAttribute( "value" ) || "",
              type = target["data-tovalidate"] || target.getAttribute( "data-tovalidate" ) || "",
              dreq = target["data-required"] || target.getAttribute( "data-required" ) || "",
              re = ( dreq == "true" ),
              ch = ( type !== "" ),
              typeF = target.type || target.getAttribute( "type" ) || "";
          if ( re ) {
            if ( typeF == "radiobutton" || typeF == "checkbox" ) {
              if ( !this.checked ) {
                _this.addWarnMesg( this, "campo requerido" );
                return true;  
              } else {
                _this.delWarnMesg( this );  
              }
            } else if ( val === "" ) {  
              _this.addWarnMesg( this, "campo requerido" );
              return true;
            } else {
              _this.delWarnMesg( this );
            }
          }
          if ( ch ) {
            if ( _this.validate( val, type ) ) {
              _this.delWarnMesg( this );
            } else {
              _this.badvalue++;            
              _this.addWarnMesg( this, "valor incorrecto" );
            }
          }
        };
    for ( ;i<l; i++ ) {
      el = document.getElementById( fields[i].getAttribute( "id" ) );
      re = el.getAttribute( "data-required" );
      ch = el.getAttribute( "data-tovalidate" );
      typeF = el.getAttribute( "type" ) || el.type || "";
      if ( re == "true" || ch !== "" ) {
        _this._off( el, "blur", myfnblur );
        _this._on( el, "blur", myfnblur );
        if ( typeF == "checkbox" || typeF == "radiobutton" ) {
          _this._on( el, "click", myfnblur );
        }
      }
    }
    i = 0;
    l = selectF.length;
  };
  Validate.prototype._on = function( el, ev, fn ){
    if( window.addEventListener ){ // modern browsers including IE9+
        el.addEventListener( ev, fn, false );
    } else if( window.attachEvent ) { // IE8 and below
        el.attachEvent( 'on' + ev, fn );
    } else {
        el['on' + ev] = fn;
    }
  };
  Validate.prototype._off = function( el, ev, fn ){
    if( window.removeEventListener ){
        el.removeEventListener(ev, fn, false);
    } else if( window.detachEvent ) {
        el.detachEvent( 'on' + ev, fn );
    } else {
        elem['on' + ev] = null; 
    }
  };
  Validate.prototype._triggerEvent = function( el, ev ) {
    var event;
    if ( document.createEvent ) {
      event = document.createEvent( "MouseEvents" );
      event.initEvent( ev, true, true);
    } else {
      event = document.createEventObject();
      event.eventType = ev;
    }
    event.eventName = ev;

    if ( document.createEvent ) {
      el.dispatchEvent( event );
    } else {
      el.fireEvent( "on" + event.eventType, event );
    }
  };
  Validate.prototype._toType = function( obj ) {
    if (typeof obj === "undefined") { return "undefined"; /* consider: typeof null === object */ }
    if (obj === null) { return "null";}
    var type = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';
    switch (type) {
      case 'Number': if (isNaN(obj)) { return "nan"; } else { return "number"; } break;
      case 'String': case 'Boolean': case 'Array': case 'Date': case 'RegExp': case 'Function': return type.toLowerCase();
    }
    if (typeof obj === "object") { return "object"; }
    return undefined;
  };
  Validate.prototype._getArrayFromTag = function( domel, tagname ) {
    return Array.prototype.slice.call( domel.getElementsByTagName( tagname ) );
  };
  Validate.prototype._getAllSiblings = function( elem, selector ) {
    var sibs = [],
        fn = function( elem ){ return ( typeof elem.tagName != "undefined" )?(elem.tagName.toUpperCase() == selector.toUpperCase()):false; },
        parentnode = elem.parentNode;
    elem = parentnode.firstChild;
    do {
      if ( !fn || fn( elem ) ) { sibs.push(elem); }
    } while ( !!( elem = elem.nextSibling ) );
    if ( sibs.length === 0 ) { sibs.push( parentnode ); }
    return sibs;
  };
  Validate.prototype._elementChildren = function( element ) {
    var childNodes = element.childNodes,
        children = [],
        i = childNodes.length;
    while (i--) {
        if (childNodes[i].nodeType == 1) {
            children.unshift(childNodes[i]);
        }
    }
    return children;
  };

  return Validate;

})();

(function () {
  'use strict';
  var _slice = Array.prototype.slice;
  try {
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
    Array.prototype.slice = function(begin, end) {
      end = (typeof end !== 'undefined') ? end : this.length;
      if (Object.prototype.toString.call(this) === '[object Array]'){ return _slice.call(this, begin, end); }
      var i, cloned = [], size, len = this.length;
      var start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);
      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) { upTo = len + end; }
      size = upTo - start;
      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }
      return cloned;
    };
  }
}());
/*
The MIT License (MIT)
Copyright (c) 2015 @manufosela

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
