var events = require("bloody-events")

module.exports = events.extend({
  constructor : function(data){
    events.constructor.call(this)
    if(!arguments.length) {
      data = {}
    }
    if(!data || typeof data != "object") {
      throw new TypeError()
    }
    this.data = data
  },
  get : function(property){
    return this.data[property]
  },
  set : function(key, value){
    var oldValue = this.data[key]
      , hadProperty = this.data.hasOwnProperty(key)
      , changeObject
    this.data[key] = value
    if(oldValue !== value) {
      changeObject = {
        key : key,
        oldValue : oldValue,
        value : value
      }
      if(!hadProperty) {
        this.fireSync("add", changeObject)
      }
      this.fireSync("change", changeObject)
    }
  },
  remove : function(key){
    var oldValue = this.data[key]
    delete this.data[key]
    if(oldValue !== void 0) {
      changeObject = {
        key : key,
        oldValue : oldValue,
        value : void 0
      }
      this.fireSync("remove", changeObject)
      this.fireSync("change", changeObject)
    }
  },
  toString : function(){
    return JSON.stringify(this.data)
  },
  valueOf : function(){
    return this.data
  }
})
