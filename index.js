var converter = require("jolo-converter");

converter.convert("jolo.yaml", {}, function(err,res){
  console.log("Errors: ", err);
});
