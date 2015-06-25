/* Valiform.js by @manufosela - 2015 */
var Valiform = (function(){

  'use strict';

  window.isIE = window.isIE || function() {
    var myNav = navigator.userAgent.toLowerCase(),
        re=new RegExp( "msie" );
    return ( re.exec( myNav ) !== null );
  };

  /*if ( isIE() && isIE()<=7 ) {
    (function(d, s) {
      d=document, s=d.createStyleSheet();
      d.querySelectorAll = function(r, c, i, j, a) {
        a=d.all, c=[], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
        for (i=r.length; i--;) {
          s.addRule(r[i], 'k:v');
          for (j=a.length; j--;) { a[j].currentStyle.k && c.push(a[j]); }
          s.removeRule(0);
        }
        return c;
      };
    })();
  }*/
  
  Valiform = function( confOpt ) {
    /**** CONFIGURE OPTIONS **********/
    confOpt = confOpt || { warningColor:"#F60", asteriskStyle:"color: #F00!important; font-size: 15px!important;", cssTextWarning:"font-size:12px!important; color:#F60!important; font-weight:bold!important; margin-bottom:10px!important;" };
    
    this.warningColor = confOpt.warningColor || "#F00";
    this.asteriskStyle = confOpt.asteriskStyle || "color:#F00!important";
    this.cssTextWarning = confOpt.cssTextWarning || "color:#F00!important";

    this.text = {
      requiredField: "campo requerido",
      wrongValue: "valor incorrecto"
    };

    /********************************/

    this.badValue = 0;
    var _this = this,
        dVld = document.querySelectorAll( "form[data-validate=true]" ),
        dChk, i = 0, lI = dVld.length, 
        j = 0, lJ, 
        okE, okV,
        formId,
        _beforeSubmit = function( e ) {
          if( e.preventDefault ) { e.preventDefault(); e.stopPropagation(); } else { e.returnValue = false; }
          e = e || window.event;
          var target = e.target || e.srcElement,
              f = target.formParam;
          if ( _this.noEmptyFields() ) { okE = true; }
          if ( _this.validateFields() ){ okV = true; }
          if ( okE && okV ) { _this._triggerEvent( f, "submit" ); }
          return false;
        };
    for( ; i<lI; i++ ) {    
      this.markRequiredFields( dVld[i] );
      this.checkFieldsRealTime( dVld[i] );
      this.hiddenFieldsActions( dVld[i] );
      formId = dVld[i].getAttribute( "id" );
      dChk = document.querySelectorAll( "#"+formId+" [type=submit][data-checkform=true]" );
      lJ = dChk.length; okE = false; okV = false;
      for ( ; j<lJ; j++ ) {
        var submitBtn = dChk[j];
        submitBtn.formParam = dVld[i];
        this._on( submitBtn, "click", _beforeSubmit);
      }
    }

    if ( document.getElementById( "valiformStyles" ) === null ) {
      var style = document.createElement( "style" );
      style.setAttribute( "id", "valiformStyles" );
      style.setAttribute( "type", "text/css" );
      if ( isIE() ) {
        style.styleSheet.cssText = ".isHidden{ display:none; }"; 
      } else {
        style.innerHTML = ".isHidden{ display:none; }"; 
      }
      document.getElementsByTagName( "head" )[0].appendChild( style );
    }
  };
  Valiform.prototype.validate = function( val, type ) {
    if ( val === "" || val === null || ( val !== "" && type == "noempty" ) ) { return true; }
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
      case "correo":
        return this.isEmail( val );
      case "iccid":
        return this.checkICCID( val );
      case "nummovil":
      case "movil":
      case "mobile":
        return this.checkNumMovil( val );
      case "numfijo":
      case "fijo":
      case "landphone":
        return this.checkNumFijo( val );
      case "telefono":
      case "tel": // fijo o movil
      case "telephone":
        return this.checkTelephoneNumber( val );
      case "cp":
      case "postalcode":
        return this.checkCodPostal( val );
      case "cuentabancaria":
      case "accountnumber":
        return this.verificaCuentaBancaria( val );
      case "tarjetacredito":
      case "creditcard":
        return this.verificaNumTarjetaCredito( val );
      case "nif":
      case "cif":
      case "nie":
        return valida_nif_cif_nie( val );
      case "fecha":
      case "date":
        return isDate( val, "dmy" );
      case "selected":
      case "noempty":
        return ( val!=="" );
    }
    return false;
  };

  Valiform.prototype.isInt = function( val ){
    return ( val == parseInt( val ) );
  };
  Valiform.prototype.isFloat = function( val ){
    return ( val == parseFloat( val ) );
  };
  Valiform.prototype.isNumber = function( val ){
    var regexp = /^[0-9\.]+$/;
    return regexp.test( val );
  };
  Valiform.prototype.isEmail = function( email ) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test( email );
  };
  Valiform.prototype.verificaCuentaBancaria = function( numcuenta ) {
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

  Valiform.prototype.verificaNumTarjetaCredito = function( numtarjeta ) {
    var result = false, 
        firstDigitCorrect = ( numtarjeta[0] == 3 || numtarjeta[0] == 4 || numtarjeta[0] == 5 || numtarjeta[0] == 6 );
    if ( numtarjeta.length == 16 && firstDigitCorrect ) {
      result = ( this._getCtrlNumberCreditCard( numtarjeta ) == numtarjeta[15] );
    }
    return result;
  };

  Valiform.prototype._getCtrlNumberCreditCard = function( numtarjeta ) {
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
  Valiform.prototype.isAlpha = function( val ) {
    var regexp = /^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ\']+$/;
    var a = regexp.test( val );
    return a;
  };
  Valiform.prototype.isAlphaGuion = function( val ) {
    var regexp = /^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ\'\-]+$/;
    var a = regexp.test( val );
    return a;
  };
  Valiform.prototype.isAlphaNumeric = function( val ){
    var regexp = /^[0-9A-Za-záéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ\']+$/;
    var a = regexp.test( val );
    return a;  
  };
  Valiform.prototype.isAlphaNumericSpace = function ( val ) {
    var regexp = /^[0-9A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ\']+$/;
    var a = regexp.test( val );
    return a;
  };
  Valiform.prototype.isDate = function( txtDate, mode ) {
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
  Valiform.prototype.checkNumMovil = function ( val ) {
    var patron = /^[67]\d{8}$/;
    var expReg = new RegExp( patron );
    return ( expReg.test( val ) )?1:0;
  };
  Valiform.prototype.checkNumFijo = function ( val ) {
    var patron = /^[89]\d{8}$/;
    var expReg = new RegExp( patron );
    return ( expReg.test( val ) )?1:0;
  };
  Valiform.prototype.checkTelephoneNumber = function ( val ) {
    return ( !this.checkNumFijo( val ) && !this.checkNumMovil( val ) )?-2:1;
  };
  Valiform.prototype.checkCodPostal = function ( val ) {
    return ( val.length == 5 && this.isInt( val ) );
  };
  Valiform.prototype.checkICCID = function ( Luhn ) {
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
  Valiform.prototype._CalculateLuhn = function ( Luhn ) {
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

  Valiform.prototype.calcDigitoControl2LineaNIF = function( s ) {
    var m = [ 7, 3, 1],
        i = 0, n = 0,
        l = s.length;
    for( ; i<l; i++ ) {
      n += s[i] * m[i % 3];
    }
    return n % 10;
  };

  Valiform.prototype._getLetraNIF = function( dni ) {
    var cadenadni = "TRWAGMYFPDXBNJZSQVHLCKE", 
        posicion = dni % 23,
        letra = cadenadni.charAt( posicion );
    return letra;
  };

  Valiform.prototype.valida_nif_cif_nie = function( a ) {
    var temp = a.toUpperCase(), temp1, temp2, i, n, pos,
        cadenadni = "TRWAGMYFPDXBNJZSQVHLCKE", posicion, letra, letradni, suma;
    if ( document.getElementById( "documento_de_identidad" ).getAttribute( "value" ) == "PASAPORTE" ) { return 1; }
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

  /*************************************************/

  // Put a span with a * in form fields with attribute data-required=true
  // Is mandatory to have a label tag to append span tag into the label tag
  Valiform.prototype.markRequiredFields = function( f, html ) {
    if ( typeof f === "undefined" ) { return false; }
    html = ( typeof html !== "undefined" )? html:"*";
    var _this = this,
        formId = f.getAttribute( "id" ),
        aEl = document.querySelectorAll("#"+formId+" [data-required=true]" ),
        i = 0, l = aEl.length,
        asterisco, sb, idAst;
    for( ; i<l; i++ ) {
      if ( aEl[i].getAttribute( "type" ) != "hidden" && aEl[i].getAttribute( "data-hidden" ) != "true" ) {
        idAst = aEl[i].getAttribute( "name" );
        if ( document.getElementById ( "asterisco_"+idAst ) === null ) {
          asterisco = document.createElement( "span" );
          asterisco.setAttribute( "id", "asterisco_" + idAst );
          asterisco.setAttribute( "style", this.asteriskStyle );
          asterisco.innerHTML=html;
          if ( document.getElementById( "label_"+idAst ) !== null ) {
            document.getElementById( "label_"+idAst ).appendChild( asterisco );
          } else {
            sb = _this._getAllSiblings( aEl[i], "LABEL" );
            if ( sb.length > 0 ) { sb[0].appendChild( asterisco ); }
          }
        }
      }
    }
  };
  Valiform.prototype.validateFields = function(){
    this.badValue=0;
    var _this=this,
        aEl = document.querySelectorAll( "[data-tovalidate]" ),
        val, type,
        i = 0, l = aEl.length;
    for( ; i<l; i++ ) {
      val = aEl[i].getAttribute( "value" ) || aEl[i].value || "";
      type = aEl[i].getAttribute( "data-tovalidate" ) || "";
      if ( !_this.validate( val, type ) ) { 
        this.badValue++; 
      }
    }
    return ( this.badValue===0 );
  };
  Valiform.prototype.noEmptyFields = function(){
    var _this = this,
        empty=0,
        aEl = document.querySelectorAll( "[data-required=true]" ),
        val, typeF,
        i = 0, l = aEl.length;
    for( ; i<l; i++ ) {
      if ( aEl[i].getAttribute( "type" ) != "hidden" && aEl[i].getAttribute( "data-hidden" ) != "true" ) {
        val = aEl[i].getAttribute( "value" ) || aEl[i].value || "";
        typeF = aEl[i].getAttribute( "type" ) || aEl[i].type || "";
        if ( typeF == "radio" ) {
          empty += _this.checkRadioField( aEl[i] );
        } else if ( typeF == "checkbox" ) {
          if ( !aEl[i].checked ) {
            _this.addWarnMesg( aEl[i], _this.text.requiredField );
            empty++;
          } else {
            _this.delWarnMesg( aEl[i] );
          }
        } else if ( val === "" ) { 
          _this.addWarnMesg( aEl[i], _this.text.requiredField );
          empty++; 
        } else {
          _this.delWarnMesg( aEl[i] );
        }
      }
    }
    return ( empty===0 );
  };
  Valiform.prototype.checkRadioField = function( el ) {
    var empty = 0,
        atLeastOne = 0,
        nameF = el.getAttribute( "name" ),
        formE = this._getParentElement( el, "form" ),
        idFormE = formE.getAttribute( "id" ),
        pEl = document.querySelector("[data-name=" + nameF + "]" ) || el,
        radF = document.querySelectorAll( "#"+idFormE+" [name=" + nameF + "]" ),
        j = 0, l2 = radF.length;
    for ( ;j<l2; j++ ){
      if ( radF[j].checked ) { atLeastOne++; break; }
    }
    if ( atLeastOne === 0 ) {
      this.addWarnMesg( pEl, this.text.requiredField );
      empty++;
    } else {
      this.delWarnMesg( pEl );
    }
    return empty;
  };
  Valiform.prototype.addWarnMesg = function( el, msg ) {
    var warning = document.createElement( "p" ),
        target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement,
        name= target.getAttribute( "name" ) || target.getAttribute( "id" ) || "",
        id = "warning-"+name;
      if ( !document.getElementById( id ) ) {
        el = document.getElementById( target.getAttribute( "id" ) || el.id );
        warning.setAttribute( "style" , this.cssTextWarning );
        warning.setAttribute( "id" , id );
        warning.innerHTML=msg;      
        el.parentElement.insertBefore( warning, el.nextSibling);  
        // el.parentElement.appendChild( warning );
        el.setAttribute( "style", "border:2px solid "+this.warningColor+"!important;" );
      }
  };
  Valiform.prototype.delWarnMesg = function( el ) {
    var target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement,
        name= target.getAttribute( "name" )|| target.getAttribute( "id" ) || "";
    if ( document.getElementById( "warning-"+name ) ) {
      target.parentElement.removeChild( document.getElementById( "warning-"+name ) );
    }
    //this.removeClass( el, "warningField" );
    this.removeStyle( el );
  };
  Valiform.prototype.hasClass = function( el, cls ) {
    var regexp = new RegExp( '(\\s|^)' + cls + '(\\s|$)' ),
        target = ( typeof el.className == "undefined" )?window.event.srcElement:el;
    return target.className.match( regexp );
  };
  Valiform.prototype.addClass = function( el, cls ){
    if( !this.hasClass( el, cls ) ) {
      var target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement,
          spc = ( target.className !== "" )?" ":"";
      target.className+=spc+cls;
    }
  };
  Valiform.prototype.removeClass = function( el, cls ) {
    if( this.hasClass( el, cls ) ) {
      var regexp = new RegExp( '(\\s|^)' + cls + '(\\s|$)' ),
          target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement;
      target.className=target.className.replace( regexp,"");
    }
  };
  Valiform.prototype.removeStyle = function( el ) {
    var target = ( typeof el.getAttribute != "undefined" )?el:window.event.srcElement;
    target.removeAttribute( "style" );
  };
  Valiform.prototype.checkFieldsRealTime = function( f ) {
    var _this = this,
        inputF = this._getArrayFromTag( f, "input" ),
        textareaF = this._getArrayFromTag( f, "textarea" ),
        selectF = this._getArrayFromTag( f, "select" ),
        fields = ( typeof textareaF != "undefined" )?inputF.concat( textareaF ):inputF,
        i = 0, l = fields.length, 
        el, re, ch, typeF,
        myfnblur = function( e ) { _this.fnBlur( e ); },
        myfnSel = function( e ) { _this.fnSel( e ); };
    for ( ;i<l; i++ ) {
      el = document.getElementById( fields[i].getAttribute( "id" ) );
      re = el.getAttribute( "data-required" );
      ch = el.getAttribute( "data-tovalidate" );
      typeF = el.getAttribute( "type" ) || el.type || "";
      if ( re == "true" || ch !== "" ) {
        _this._off( el, "blur", myfnblur );
        _this._on( el, "blur", myfnblur );
        if ( typeF == "checkbox" || typeF == "radio" ) {
          _this._on( el, "click", myfnblur );
        }
      }
    }
    i = 0;
    l = selectF.length;
    for ( ;i<l; i++ ) {
      el = document.getElementById( selectF[i].getAttribute( "id" ) );
      re = el.getAttribute( "data-required" );
      if ( re == "true" ) {
        _this._on( el, "click", myfnSel );
        _this._on( el, "change", myfnSel );
        _this._on( el, "blur", myfnSel );
      }
    }
  };
  Valiform.prototype.hiddenFieldsActions = function(){
    //TODO: hay que tratar 2 atributos: data-hidden=true y data-activate
    var _this = this,
        toActivate = document.querySelectorAll( "[data-activate]" ),
        i=0, l=toActivate.length, elAc, 
        nameAc, elAcs,
        j, l2,
        parentEl, parentElId,
        myShowHidden = function( e ){ _this.fnShowHidden( e ); };
    for( ;i<l; i++ ){
      this.addClass( toActivate[i], "isHidden" ); // Todos los elementos que tengan el atributo data-activate deben estar display:none
      elAc = document.getElementById( toActivate[i].getAttribute( "data-activate" ) );
      if ( elAc ) {
        nameAc = elAc.getAttribute( "name" );
        parentEl = this._getParentElement( toActivate[i], "form" );
        parentElId = parentEl.getAttribute( "id" );
        elAcs = document.querySelectorAll( "#"+parentElId+" [name="+nameAc+"]" );
        j = 0; l2 = elAcs.length;
        for( ;j<l2; j++ ) {
          this._on( elAcs[j], "blur", myShowHidden );
          this._on( elAcs[j], "click", myShowHidden );
        }
      }
    }
  };
  Valiform.prototype.fnBlur = function( e ) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        val = target.value || target.getAttribute( "value" ) || "",
        type = target["data-tovalidate"] || target.getAttribute( "data-tovalidate" ) || "",
        dreq = target["data-required"] || target.getAttribute( "data-required" ) || "",
        re = ( dreq == "true" ),
        ch = ( type !== "" ),
        typeF = target.type || target.getAttribute( "type" ) || "";
    if ( re ) {
      if ( typeF == "radio" ) {
        this.checkRadioField( target );
      } else if ( typeF == "checkbox" ) {
        if ( !target.checked ) {
          this.addWarnMesg( target, this.text.requiredField );
          return true;  
        } else {
          this.delWarnMesg( target );  
        }
      } else if ( val === "" ) {  
        this.addWarnMesg( target, this.text.requiredField );
        return true;
      } else {
        this.delWarnMesg( target );
      }
    }
    if ( ch ) {
      if ( this.validate( val, type ) ) {
        this.delWarnMesg( target );
      } else {
        this.badValue++;            
        this.addWarnMesg( target, this.text.wrongValue );
      }
    }
  };
  Valiform.prototype.fnSel = function( e ) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        val = target.value || target.getAttribute( "value" ) || "";
    if ( val === "" ) {
      this.addWarnMesg( target, this.text.requiredField );
      return true;  
    } else {
      this.delWarnMesg( target );  
    }
  };
  Valiform.prototype.fnShowHidden = function( e ){
    e = e || window.event;
    var target = e.target || e.srcElement,
    toActivateId, toDeactivateId,
    id = target.id || target.getAttribute( "id" ) || "",
    toActivate = document.querySelectorAll( "[data-activate="+id+"]" ),
    toDeactivate = document.querySelectorAll( "[data-deactivate="+id+"]" ),
    i = 0, lA = toActivate.length, lD = toDeactivate.length, 
    inHid, j, l2,
    typEl, parEl, tagEl;
    if ( lA > 0 ) {
      for( ;i<lA; i++ ) {
        this.removeClass( toActivate[i], "isHidden" );
        toActivateId = toActivate[i].getAttribute( "id" );
        inHid = document.querySelectorAll( "#"+toActivateId+" input[data-hidden=true]" );
        j=0; l2=inHid.length;
        for( ;j<l2; j++ ) {
          inHid[j].setAttribute( "data-hidden", "true" ); 
        }
      }
    } 
    if ( lD > 0 ) {
      for( ;i<lD; i++ ) {
        this.addClass( toDeactivate[i], "isHidden" );
        toDeactivateId = toDeactivate[i].getAttribute( "id" );
        inHid = document.querySelectorAll( "#"+toDeactivateId+" input[data-hidden=false]" );
        j=0; l2=inHid.length;
        for( ;j<l2; j++ ) {
          inHid[j].setAttribute( "data-hidden", "true" );
          typEl = inHid[j].getAttribute( "type" ) || inHid[j].type;
          parEl = inHid[j].parentElement;
          tagEl = parEl.tagName.toUpperCase() || "";
          if ( tagEl == "LABEL" ) {
            if ( typEl == "radio" ) { this.removeClass( parEl, 'r_on' ); }
            if ( typEl == "checkbox" ) { this.removeClass( parEl, 'c_on' ); }
          }
        }
      }
    }
  };
  Valiform.prototype._on = function( el, ev, fn ){
    if( window.addEventListener ){ // modern browsers including IE9+
        el.addEventListener( ev, fn, false );
    } else if( window.attachEvent ) { // IE8 and below
        el.attachEvent( 'on' + ev, fn );
    } else {
        el['on' + ev] = fn;
    }
  };
  Valiform.prototype._off = function( el, ev, fn ){
    if( window.removeEventListener ){
        el.removeEventListener(ev, fn, false);
    } else if( window.detachEvent ) {
        el.detachEvent( 'on' + ev, fn );
    } else {
        elem['on' + ev] = null; 
    }
  };
  Valiform.prototype._triggerEvent = function( el, ev ) {
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
  Valiform.prototype._toType = function( obj ) {
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
  Valiform.prototype._getArrayFromTag = function( domel, tagname ) {
    return Array.prototype.slice.call( domel.getElementsByTagName( tagname ) );
  };
  Valiform.prototype._getAllSiblings = function( elem, selector ) {
    var sibs = [];
    if ( typeof elem != "undefined" ) {
      var fn = function( elem ){ return ( typeof elem.tagName != "undefined" )?(elem.tagName.toUpperCase() == selector.toUpperCase()):false; },
          parentnode = elem.parentNode;
      elem = parentnode.firstChild;
      do {
        if ( !fn || fn( elem ) ) { sibs.push(elem); }
      } while ( !!( elem = elem.nextSibling ) );
      if ( sibs.length === 0 ) { sibs.push( parentnode ); }
    }
    return sibs;
  };
  Valiform.prototype._getParentElement = function( el, tagname ) {
    tagname = tagname.toUpperCase();
    var parentE = el;
    do {
      parentE = parentE.parentElement;
    } while ( parentE !== null && parentE.tagName.toUpperCase() !== tagname );
    return parentE;
  };
  Valiform.prototype._elementChildren = function( element ) {
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

  return Valiform;

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