let express = require('express'),
  bodyParser = require('body-parser'),
  port = 443,
  app = express();
let alexaVerifier = require('alexa-verifier');
var isFisrtTime = true;
const fs=require('fs');
const path=require('path');
const https=require('https');
const Speech = require ('ssml-builder');
const directoryToServe='client'
const SKILL_NAME = 'BD';
let WELCOME_MESSAGE='Bienvenido al baúl de BD. ';
//onst GET_HERO_MESSAGE = "Here's your hero: ";
const HELP_REPROMPT = 'Puedes intentar preguntarme ¿Qué es una base de datos? o ¿Qué es un modelo relacional?';
const HELP_MESSAGE = '¿En que puedo ayudarte? Preguntame algo acerca de BD hace o dí "Para", para salir.';
const STOP_MESSAGE = 'Disfruta el día...¡adios!';
const MORE_MESSAGE = '¡Pregúntame otra cosa!';
const PAUSE = '<break time="0.3s" />';
const WHISPER = '<amazon:effect name="whispered">';
const CLOSE_WHISPERED = '</amazon:effect>';
let concep=[{'concepto': 'Dato' , 'info' : 'Los datos son la representación simbólica, bien sea mediante números o letras de una recopilación de información la cual puede ser cualitativa o cuantitativa, que facilitan la deducción de una investigación o un hecho. '},
{'concepto': 'Banco de datos' , 'info' : 'Colección de datos públicos organizados de forma que su búsqueda y recuperación con el ordenador sea fácil y rápida. Se encarga de construir y mantener una base de datos, que ofrece a terceros a cambio de una remuneración. '},
{'concepto': 'Campo' , 'info' : 'Es una unidad sencilla de datos que es única dentro de la entrada o fila, pero la categoría de datos general es común a todas las entradas. '},
{'concepto': 'Registro' , 'info' : 'Es una fila de una base de datos, una agrupación horizontal de datos. El contenido de estos campos es único para esa fila. '},
{'concepto': 'Archivo' , 'info' : 'Son datos almacenados en formato estructurado, organizados en tablas y campos que permiten su localización y acceso más rápido. '},
{'concepto': 'Información' , 'info' : 'Es un conjunto de datos acerca de algún suceso, hecho, fenómeno o situación, que organizados en un contexto determinado tienen su significado, cuyo propósito puede ser el de reducir la incertidumbre o incrementar el conocimiento acerca de algo. '},
{'concepto': 'Sistema de información' , 'info' : 'Es un conjunto de elementos que interactúan entre sí con un fin común, que permite que la información esté disponible para satisfacer las necesidades en una organización. '},
{'concepto': 'Modelo jerárquico' , 'info' : 'Un modelo de datos jerárquico es un modelo de datos en el cual los datos son organizados en una estructura parecida a un árbol. La estructura permite a la información que se repite y usa relaciones padre/Hijo. '},
{'concepto': 'Modelo de red' , 'info' : 'Se basa en el modelo jerárquico, permitiendo relaciones de muchos a muchos entre registros vinculados, lo que implica registros principales múltiples.'},
{'concepto': 'Modelo orientado a objetos' , 'info' : 'Se  define una base de datos como una colección de objetos, o elementos de software reutilizables, con funciones y métodos relacionados.'},
{'concepto': 'Redundancia' , 'info' : 'Es la información repetida, la cual aumenta los costos de almacenamiento y búsqueda. La redundancia produce inconsistencia en los datos. Una base de datos no debe tener redundancia. '},
{'concepto': 'Consistencia' , 'info' : 'Coherencia en los datos. Los datos de una base de datos deben ser coherentes. '},
{'concepto': 'Concurrencia' , 'info' : 'La concurrencia permite que muchas transacciones puedan realizarse en una misma base de datos a la vez. Para este sistema se necesita algún mecanismo de control para que las operaciones simultáneas no interfieran entre sí.  Son las cosas que suceden en un mismo tiempo en una base de datos. '},
{'concepto': 'Integridad' , 'info' : 'Se referirse a la exactitud y fiabilidad de los datos. Los datos deben estar completos, sin variaciones o compromisos del original, que se considera confiable y exacto. '},
{'concepto': 'Seguridad' , 'info' : 'En una base de datos debe haber confiabilidad y disponibilidad de la información. '},
{'concepto': 'Independencia de los datos' , 'info' : 'Es la capacidad para modificar el esquema en un nivel del sistema sin tener que modificar el esquema del nivel inmediato superior.'},
{'concepto': 'Independencia lógica de los datos' , 'info' : 'Es la capacidad de modificar el esquema conceptual sin tener que alterar los esquemas externos ni los programas de aplicación. Se puede modificar el esquema conceptual para ampliar la base de datos o para reducirla. '},
{'concepto': 'Independencia física de los datos' , 'info' : 'Es la capacidad de modificar el esquema interno sin tener que alterar el esquema conceptual (o los externos). Por ejemplo, puede ser necesario reorganizar ciertos ficheros físicos con el fin de mejorar el rendimiento de las operaciones de consulta o de actualización de datos. '},
{'concepto': 'Atributo' , 'info' : 'Campos de una tabla, propiedades de las entidades.'},
{'concepto': 'Dominio' , 'info' : 'Es una colección de valores, de los cuales uno o más atributos obtienen sus valores reales. Pueden ser finitos (días de la semana, meses del año, letras del alfabeto, etc..) o infinitos (números realeso días del calendario). '},
{'concepto': 'Cardinalidad' , 'info' : 'Es el número de filas o tuplas de una relación. '},
{'concepto': 'Reglas de Codd' , 'info' : 'Son 12 reglas inventadas en 1969 por Edgar Codd, él se percató de que existían bases de datos en el mercado las cuales decían ser relacionales, pero lo único que hacían era guardar la información en las tablas sin estar normalizadas. '},
{'concepto': 'Llave foránea' , 'info' : 'atributo(s) de una relación r1 que hacen referencia a otra relación r2. '},
{'concepto': 'Llave primaria' , 'info' : 'Llave candidata que se escoge en el modelo para identificar cada tupla. '},
{'concepto': 'Normalizacion' , 'info' : 'La normalización de base de datos es una técnica de modelado consistente en designar y aplicar una serie de reglas a las relaciones obtenidas tras el paso del modelo entidad-relación al modelo relacional. '},
{'concepto': 'Indices' , 'info' : 'Conjunto de punteros que están ordenador lógicamente según los valores de una clave. Los índices proporcionan acceso rápido a los datos y pueden imponer la exclusividad de los valores de clave para las filas en la tabla. '},
{'concepto': 'Operadores' , 'info' : 'La unión, la intersección, el producto, AND, OR, NOT. '},
{'concepto': 'Diccionario de datos' , 'info' : 'Un diccionario de datos es un conjunto de definiciones que contiene las características lógicas y puntuales de los datos que se van a utilizar en el sistema que se programa, incluyendo nombre, descripción, alias, contenido y organización. '},
{'concepto': '' , 'info' : ''}
];

const httpsOptions ={
	cert:fs.readFileSync("/home/BrayanQuirino/prueba/ssl/fullchain.pem"),
	key:fs.readFileSync("/home/BrayanQuirino/prueba/ssl/privkey.pem")
}
app.get('/',function(req,res){
	res.send('hello Wordl!');
});
app.use(bodyParser.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

function requestVerifier(req, res, next) {
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        res.status(401).json({
          message: 'Verification Failure',
          error: err
        });
      } else {
        next();
      }
    }
  );
}

function log() {
  if (true) {
    console.log.apply(console, arguments);
  }
}

app.post('/valquiria', requestVerifier, function(req, res) {

  if (req.body.request.type === 'LaunchRequest') {
    res.json(welcome());
    isFisrtTime = false
  } else if (req.body.request.type === 'SessionEndedRequest') { /* ... */
    log("Session End")
  } else if (req.body.request.type === 'IntentRequest') {
    switch (req.body.request.intent.name) {
      case 'BDIntent':
        res.json(whatIsBD());
        break;
      case 'SQLIntent':
        res.json(whatIsSQL());
        break;
      case 'RelacionalIntent':
        res.json(whatIsRelacional());
        break;
      case 'SMBDIntent':
          res.json(whatIsSMBD());
          break;
      case 'derIntent':
          res.json(whatIsder());
          break;
      case 'origenIntent':
        res.json(history());
        break;
      case 'conceptosIntent':
          res.json(conceptos(req.body.request.intent.slots.concepto.value));
          break;
      case 'AMAZON.YesIntent':
        res.json(history());
        break;
      case 'AMAZON.NoIntent':
          res.json(no());
          break;
      case 'typesIntent':
          res.json(typesOfDB());
          break;
      case 'AMAZON.HelpIntent':
        res.json(help());
        break;
      case 'AMAZON.StopIntent':
        res.json(stopAndExit());
        break;
      default:
        res.json(nose());
        break;

    }
  }
});

function handleDataMissing() {
  return buildResponse(MISSING_DETAILS, true, null)
}

function stopAndExit() {

  const speechOutput = STOP_MESSAGE
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}

function help() {

  const speechOutput = HELP_MESSAGE
  const reprompt = HELP_REPROMPT
  var jsonObj = buildResponseWithRepromt(speechOutput, false, "", reprompt);

  return jsonObj;
}

function welcome() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE = '';
  }
  const tempOutput = WELCOME_MESSAGE+ PAUSE;
  const speechOutput = tempOutput + 'Puedes perguntarme "¿qué es una BD?" o "¿qué es un modelo relacional?"'
  const more = MORE_MESSAGE
  return buildResponseWithRepromt(speechOutput, false, 'WELCOME', more);

}
function nose() {
  const tempOutput = '¡Vaya! Ahora si me metiste en aprietos, en realidad no sé qué contestar pero me '+
  'pondré en contacto con los creadores. '+WHISPER+ 'Por lo mientras puedo darte conceptos básicos de BD. '
  +CLOSE_WHISPERED+ PAUSE;
  const speechOutput = tempOutput;
  const more = MORE_MESSAGE
  return buildResponseWithRepromt(speechOutput, false, 'WELCOME', more);
}
function whatIsBD() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE = '';
  }
  const more = WHISPER+'Tambien puedes preguntarme ¿qué es un sistema manejador de bd?'+CLOSE_WHISPERED;
  const tempOutput = 'Una base de datos es un “almacén”'+PAUSE+
  ' que nos permite guardar grandes cantidades de información '+PAUSE+
  'de forma organizada para que luego podamos encontrar y utilizar fácilmente. '+PAUSE+
  more;
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'BD', more);

}
function conceptos(peticion) {
  let concepto='';
  let info='';
  for (i in concep){
    if(normalizador(concep[i].concepto).toLocaleUpperCase()==normalizador(peticion).toLocaleUpperCase()){
      concepto= concep[i].concepto;
      info=concep[i].info
    }
  }
  let more;
  let tempOutput;
  if(concepto!=''){
    more = WHISPER+'Aún tengo mas conceptos, ¡intenta preguntarme uno que no sepa!'+CLOSE_WHISPERED;
    tempOutput = ''+concepto+': '+PAUSE+
    ''+info+''+PAUSE+more;
  }else{
    tempOutput = '¡Vaya! Ahora si me metiste en aprietos, en realidad no sé qué contestar pero me '+
    'pondré en contacto con los creadores. '+WHISPER+ 'Por lo mientras puedo darte otro concepto. '
    +CLOSE_WHISPERED+ PAUSE;
    more = MORE_MESSAGE
  }
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'BD', more);
}
function whatIsSQL() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE = '';
  }
  const more = MORE_MESSAGE
  const tempOutput ='SQL (Structured Query Language)'+PAUSE+
  ' es un lenguaje de programación estándar e interactivo '+PAUSE+
  'para la obtención de información desde una base de datos y para actualizarla. '
  + PAUSE+more;
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'SQL', more);

} 
function whatIsSMBD() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE= '';
  }
  const more =  WHISPER +'Podrías preguntarme que es SQL' +CLOSE_WHISPERED;
  const tempOutput ='Es una colección de software muy específico,' 
  +' cuya función es servir de interfaz entre la base de datos, el usuario y'+
  ' las distintas aplicaciones utilizadas. '+PAUSE+more;
  + PAUSE;
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'SMBD', more);

}
function typesOfDB() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE= '';
  }
  const more =  WHISPER +'Tambien se lo que es un diagrama entidad-relación. Solo tienes que preguntar por ello. ' +CLOSE_WHISPERED;
  const tempOutput ='Hay bases de datos relacionales, como MySQL,'+
  ' SQL Server y Oracle. Como su nombre lo indica '+PAUSE+'utilizan el modelo relacional'+
  ' y siempre es mejor usarlas cuando los datos son consistentes y tienes algo planificado.'+PAUSE+
  ' También existen las no relacionales, como MongoDB y Redis,'+
  ' conocidas como NO-SQL (Not Only SQL).'+' Estas son más flexibles en cuanto a consistencia de datos'+
  ' y se han convertido en una opción que intenta solucionar algunas limitaciones'+
  ' que tiene el modelo relacional. '+PAUSE+more;
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'Types', more);

}
function whatIsder() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE= '';
  }
  const more =  WHISPER +'Conozco un poco de historia de las BD. ¿Te gustaria saber un poco más?' +CLOSE_WHISPERED;
  const tempOutput ='Es un tipo de diagrama de flujo que ilustra cómo las "entidades",'+
  ' como personas, objetos o conceptos, se relacionan entre sí dentro de un sistema. '
  +PAUSE+more;
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'DER', more);

}
function history() {

  if (!isFisrtTime) {
    WELCOME_MESSAGE= '';
  }
  const more =  MORE_MESSAGE;
  const tempOutput ='El término Base de Datos fue acuñado por primera vez en 1963.'+
  ' En la década de los 70\'s '+PAUSE+'Edgar Frank Codd definió el modelo relacional y publicó una serie de reglas'
  +PAUSE+' para la evaluación de administradores de sistemas de datos relacionales.'+ 
  ' En la década de los 80\'s las bases de datos relacionales integraron el sistema de tablas, filas y columnas. '
  +PAUSE+more;
  const speechOutput = tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'History', more);

}
function no() {

  const tempOutput = 'Ok, lo entiendo. Puedes preguntarme "¿Cuáles son los conceptos básicos de BD?"'+PAUSE;
  +PAUSE+more;
  const speechOutput = tempOutput;
  return buildResponse(speechOutput, false, 'NO');

}
function whatIsRelacional() {

  if (!isFisrtTime) {
   WELCOME_MESSAGE = '';
  }
  const more = MORE_MESSAGE
  const tempOutput ='Modelo de organización y gestión de bases de datos'
  +PAUSE+' consistente en el almacenamiento de datos en tablas compuestas por filas, o tuplas,'+ 
  ' y columnas o campos. Se distingue de otros modelos, como el jerárquico, por ser más comprensible'+
  ' para el usuario inexperto, y por basarse en la lógica de predicados para establecer relaciones entre distintos datos. '
  + PAUSE+more+' Por ejemplo "¿Qué tipos de base de datos existen?"';
  const speechOutput =  tempOutput;
  return buildResponseWithRepromt(speechOutput, false, 'Relacional', more);

}  
function buildResponse(speechText, shouldEndSession, cardText) {

  const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
    "version": "1.0",
    "response": {
      "shouldEndSession": shouldEndSession,
      "outputSpeech": {
        "type": "SSML",
        "ssml": speechOutput
      },
      "card": {
        "type": "Simple",
        "title": SKILL_NAME,
        "content": cardText,
        "text": cardText
      }
    }
  }
  return jsonObj
}

function buildResponseWithRepromt(speechText, shouldEndSession, cardText, reprompt) {

  const speechOutput = "<speak>" + speechText + "</speak>"
    var jsonObj = {
     "version": "1.0",
     "response": {
      "shouldEndSession": shouldEndSession,
       "outputSpeech": {
         "type": "SSML",
         "ssml": speechOutput
       },
     "card": {
       "type": "Simple",
       "title": SKILL_NAME,
       "content": cardText,
       "text": cardText
     },
     "reprompt": {
       "outputSpeech": {
         "type": "PlainText",
         "text": reprompt,
         "ssml": reprompt
       }
     }
   }
 }
  return jsonObj
}
var normalizador = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' );
  }
 
})();
app.listen(8080);
https.createServer(httpsOptions,app).listen(port,function(){
	console.log(`Serving the ${directoryToServe} directory at https:vmonet:${port}`);	
})
console.log('Alexa list RESTful API server started on: ' + port);
