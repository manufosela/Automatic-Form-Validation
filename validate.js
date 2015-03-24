var Validate = (function(){

  'use strict';
  
  Validate = function() {

  };

  Validate.prototype.validate = function( val, type ) {
    if ( val === "" && type != "noempty" ) { return true; }
    switch( type ) {
      case "int":
      case "integer":
        return this.isInt( val );
      case "float":
        return this.isFloat( val );
      case "number":
        return this.isNumber( val );  // integer o float
      case "alpha":
      case "text":
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
        return this.checkNumMovil( val );
      case "numfijo":
        return this.checkNumFijo( val );
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

  Validate.prototype.cleanMsgError = function( name ) {
    if ( !!~name.indexOf( "fn_" ) ) { name = 'fec_nac'; }
    $( "#"+name+"_msgError_Layer" ).html ( "" );
    $( "#"+name ).css( { "border-color": "#333" } );
  };

  Validate.prototype.appendHtml = function( el, name, msgError, border ) {
    if ( typeof msgError != "undefined" ) {
      if ( typeof border == "undefined" ) { border = true; }
      if ( $( "#"+name+"_msgError_Layer" ).length === 0 ) {
        var htmlMsgError = "<span class='error' id='"+name+"_msgError_Layer'>&nbsp;&nbsp;" + msgError + "</span>";
        el.append( htmlMsgError );
      } else {
        $( "#"+name+"_msgError_Layer" ).html( msgError );
      }
      if ( border ) { $( "#"+name ).css( { "border": "1px solid #F00" } ); }
    }
  };

  Validate.prototype.restoreErrorLayer = function( name ) {
    if ( $( "#"+name+"_msgError_Layer" ).length !== 0 ) {
      $( "#"+name+"_msgError_Layer" ).remove();
      $( "#"+name ).css( { "border": "1px solid #CCC" } );
    }
  };

  return Validate;

})();
