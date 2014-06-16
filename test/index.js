var tape = require("tape")
var observable = require("../")

tape("observable", function(test){
  test.deepEqual(
    observable.create().valueOf(),
    {},
    "is an empty object by default"
  )
  var object = {}
  test.deepEqual(
    observable.create(object).valueOf(),
    object,
    "sets as object if object"
  )
  test.end()
})

tape("observable defaults", function(test){
  test.deepEqual(
    observable
      .extend({
        getDefaults : function(){
          return {
            foo : "bar",
            bar : "baz"
          }
        }
      })
      .create({
        foo : "foo"
      })
      .valueOf(),
      {
        foo : "foo",
        bar : "baz"
      },
    "merges with defaults"
  )
  test.end()
})

tape("observable.get()", function(test){
  var object = observable.create({foo:"bar"})
  test.equal(object.get("foo"), "bar", "gets")
  test.end()
})

tape("observable.set()", function(test){
  var object = observable.create({foo:"bar"})
  object.set({ foo : "baz"})
  test.equal(object.get("foo"), "baz", "sets")
  test.end()
})

tape("observable.remove()", function(test){
  var object = observable.create({foo:"bar"})
  object.remove("foo")
  test.equal(object.get("foo"), void 0, "removes")
  test.notOk("foo" in object.data, "removes")
  test.end()
})

tape("observable.toString()", function(test){
  var object = observable.create({foo:"bar"})
  var json = object.toString().replace(/\s/g,"")
  test.equal(json, "{\"foo\":\"bar\"}")
  test.end()
})

tape("observable.valueOf()", function(test){
  var object = observable.create({foo:"bar"})
  test.equal(object.valueOf(), object.data)
  test.end()
})

tape("events (no change)", function(test){
  var object = observable.create({foo:"bar"})
  object.on("change", function(){
    test.fail()
  })
  object.on("add", function(){
    test.fail()
  })
  object.on("remove", function(){
    test.fail()
  })
  object.set({"foo": "bar"})
  test.end()
})

tape("events (change, change)", function(test){
  var object = observable.create({foo:"bar"})
  object.on("change", function(change){
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : "bar",
        value : "baz"
      }
    )
  })
  object.on("add", function(){
    test.fail()
  })
  object.on("remove", function(){
    test.fail()
  })
  object.set({"foo": "baz"})
  test.end()
})

tape("events (change, add)", function(test){
  var object = observable.create()
  var changeEvent = false
  object.on("change", function(change){
    changeEvent = true
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : void 0,
        value : "baz"
      }
    )
  })
  object.on("add", function(change){
    test.equal(changeEvent, false, "change event occurs after")
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : void 0,
        value : "baz"
      }
    )
  })
  object.on("remove", function(){
    test.fail()
  })
  object.set({
    "foo": "baz"
  })
  test.end()
})


tape("events (change, remove)", function(test){
  var object = observable.create({foo:"bar"})
  var changeEvent = false
  object.on("change", function(change){
    changeEvent = true
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : "bar",
        value : void 0
      }
    )
  })
  object.on("remove", function(change){
    test.equal(changeEvent, false, "change event occurs after")
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : "bar",
        value : void 0
      }
    )
  })
  object.on("add", function(){
    test.fail()
  })
  object.remove("foo")
  test.end()
})


tape("events (change, remove)", function(test){
  var object = observable.create({foo:"bar"})
  var changeEvent = false
  object.on("change", function(change){
    changeEvent = true
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : "bar",
        value : void 0
      }
    )
  })
  object.on("remove", function(change){
    test.equal(changeEvent, false, "change event occurs after")
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : "bar",
        value : void 0
      }
    )
  })
  object.on("add", function(){
    test.fail()
  })
  object.remove("foo")
  test.end()
})



tape("dispatcher", function(test){
  var object = observable.create({
    foo : "bar",
    bar : "baz",
    baz : "foo"
  })
  object.dispatch(function(changes){
    test.deepEqual(changes, {
      foo : void 0,
      bar : "foo",
      baz : "bar"
    })
    test.end()
  })
  object.set({
    bar : "foo",
    baz : "bar"
  })
  object.remove("foo")
})


tape("dispatcher", function(test){
  var object = observable.create({
    foo : "bar",
    bar : "baz",
    baz : "foo"
  })
  var cb = function(changes){
    test.deepEqual(changes, {
      foo : void 0,
      bar : "foo",
      baz : "bar"
    })
    object.stopDispatch(cb)
    object.set({
      foo : "bar",
      bar : "baz",
      baz : "foo"
    })
    test.end()
  }
  object.dispatch(cb)
  object.set({
    bar : "foo",
    baz : "bar"
  })
  object.remove("foo")
})
