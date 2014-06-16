var events = require("bloody-events")
var asap = require("asap")
var expando = "dispatch" + String(Math.random())

function indexOfCallback(array, value) {
  var index = -1
  var length = array.length
  while(++index < length) {
    if(array[index].cb === value) {
      return index
    }
  }
  return -1
}

module.exports = events.extend({
  constructor : function(data){
    var key
    var object
    events.constructor.call(this)
    object = this.getDefaults()
    this._dispatchers = []
    if(data != null && typeof data == "object") {
      for(key in data) {
        object[key] = data[key]
      }
    }
    this.data = object
  },
  destructor : function(){
    events.destructor.call(this)
    this.off(expando)
    this._dispatchers.length = 0
  },
  getDefaults : function(){
    return {}
  },
  get : function(property){
    return this.data[property]
  },
  set : function(object){
    var key
    for(key in object) {
      setter.call(this, key, object[key])
    }
    function setter(key, value){
      var oldValue = this.data[key]
      var hadProperty = this.data.hasOwnProperty(key)
      var changeObject
      this.data[key] = value
      if(oldValue !== value) {
        changeObject = {
          key : key,
          oldValue : oldValue,
          value : value
        }
        if(!hadProperty) {
          this.emit("add", changeObject)
        }
        this.emit("change", changeObject)
        this.emit(expando, changeObject)
      }
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
      this.emit("remove", changeObject)
      this.emit("change", changeObject)
      this.emit(expando, changeObject)
    }
  },
  toString : function(){
    return JSON.stringify(this.data)
  },
  valueOf : function(){
    return this.data
  },
  dispatch : function(cb){
    var accumulator = []
    var callback
    if(indexOfCallback(this._dispatchers, cb) != -1) {
      return
    }
    callback = function(changes){
      accumulator.push([changes.key, changes.value])
      asap(function(){
        if(!accumulator.length) {
          return
        }
        var dataUpdate = {}
        var item
        while(item = accumulator.shift()) {
          dataUpdate[item[0]] = item[1]
        }
        cb(dataUpdate)
      })
    }
    callback.cb = cb
    this._dispatchers.push(callback)
    this.on(expando, callback)
  },
  stopDispatch : function(cb){
    var index
    if(cb == null) {
      this.off(expando)
      return
    }
    index = indexOfCallback(this._dispatchers, cb)
    if(index == -1) {
      return
    }
    this.off(expando, this._dispatchers.splice(index, 1)[0])
  }
})
