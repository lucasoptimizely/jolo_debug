_ = require('lodash');

var DEFAULT_DATA_TYPES = ['array', 'boolean', 'integer', 'number', null, 'string'];

var exactMatch = function(r, str){
  var match = str.match(r);
  return match != null && str == match[0];
}

var preprocessDataTypes = function(datatypes){
  var inSchema = {};
  for(var i in DEFAULT_DATA_TYPES){
    inSchema[DEFAULT_DATA_TYPES[i]] = {primitive: true}
  };
  for(var typeKey in datatypes) {
    var datatype = datatypes[typeKey];
    inSchema[typeKey] = _.assignIn(datatype, {primitive: false})
  };
  return inSchema;
};

var preprocessObjects = function(datatypes, objects){
  for(var objectName in objects){
    var object = objects[objectName];
    // for(var propName in object.properties){
    //   var prop = object.properties[propName];
    //   for(var type in prop.types){
    //     var settings = prop.types[type];
    //
    //     if(datatypes[type] && !datatypes[type].primitive){
    //       prop.types[type] = datatypes[type].representation;
    //     } else if (objects[type]) {
    //       prop.types[type] = objects[type].representation;
    //     }
    //   }
    // }
    datatypes[objectName] = _.assignIn(object, {primitive: false});
  }
};

var preprocessFunctions = function(datatypes, functionTypes, functions){
  for(var functionName in functions){
    // Creating the representation field for each function
    var functionsObject = functions[functionName];
    if(!functionsObject.representation){
      var functionType = functionsObject.type;
      functionsObject.representation = functionTypes[functionType].representation;
    }
  }
}


var preProcessAll = function(raw, options){
  var datatypes = raw && raw.types && raw.types.datatypes;

  var allDataTypes = preprocessDataTypes(datatypes);
  var objects = raw && raw.types && raw.types.objects;

  preprocessObjects(allDataTypes, objects);

  preprocessFunctions(allDataTypes, raw.functionTypes, raw.functions);

};


var external = {
  preprocess : function(raw, options, callback){
    try {
      preProcessAll(raw, options);
      if(callback){
        callback(null, raw);
      }
      return raw;
    } catch (ex) {
      if(callback){
        callback(ex);
      } else {
        throw(ex);
      }
    }
  }
};

module.exports = external;
