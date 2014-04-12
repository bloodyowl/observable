var tape = require("tape")
  , observable = require("../")

tape("observable", function(test){
  test.throws(function(){
    observable.create(null)
  })
  test.throws(function(){
    observable.create("")
  })
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

tape("observable.get()", function(test){
  var object = observable.create({foo:"bar"})
  test.equal(object.get("foo"), "bar", "gets")
  test.end()
})

tape("observable.set()", function(test){
  var object = observable.create({foo:"bar"})
  object.set("foo", "baz")
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
    , json = object.toString().replace(/\s/g,"")
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
  object.listen("change", function(){
    test.fail()
  })
  object.listen("add", function(){
    test.fail()
  })
  object.listen("remove", function(){
    test.fail()
  })
  object.set("foo", "bar")
  test.end()
})

tape("events (change, change)", function(test){
  var object = observable.create({foo:"bar"})
  object.listen("change", function(change){
    test.deepEqual(
      change,
      {
        key : "foo",
        oldValue : "bar",
        value : "baz"
      }
    )
  })
  object.listen("add", function(){
    test.fail()
  })
  object.listen("remove", function(){
    test.fail()
  })
  object.set("foo", "baz")
  test.end()
})

tape("events (change, add)", function(test){
  var object = observable.create()
    , changeEvent = false
  object.listen("change", function(change){
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
  object.listen("add", function(change){
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
  object.listen("remove", function(){
    test.fail()
  })
  object.set("foo", "baz")
  test.end()
})


tape("events (change, remove)", function(test){
  var object = observable.create({foo:"bar"})
    , changeEvent = false
  object.listen("change", function(change){
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
  object.listen("remove", function(change){
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
  object.listen("add", function(){
    test.fail()
  })
  object.remove("foo")
  test.end()
})
