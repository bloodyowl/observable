# observable

[![browser support](https://ci.testling.com/bloodyowl/observable.png)
](https://ci.testling.com/bloodyowl/observable)

![https://travis-ci.org/bloodyowl/observable](https://travis-ci.org/bloodyowl/observable.svg)

## install

```sh
$ npm install bloody-observable
```

## require

```javascript
var observable = require("bloody-observable")
```

## api

### `observable.extend(options) > subclass`

creates an observable subclass.

#### `options.getDefaults`

function that returns the default value for `data`, will be merged with
the data. default `getDefaults` returns an empty object.

### `observable.create([data={}]) > o`

creates a new observable instance.
optionally takes a `data` argument (which, if set, must be an object).
if not set, `data` is a new empty `object`.

### `o.get(key)`

returns the value for `key`.

### `o.set({key: value, key2: value2 …})`

sets `value` as value for `key`.

### `o.remove(key)`

removes the value for `key`

### `o.toString()`

returns the JSON string of the observable data.

### `o.valueOf()`

returns the observable data.

### `o.on(type, listener)`

listens the the `type` event and attaches `listener` to it.

### `o.off([type[, listener]])`

stops listening :

- if no argument is set : all events
- if `type` is set : all `type` events
- if `type` and `listener` are set : the `listener` for this `type`

### `o.emit(type[, data…])`

fires synchronously the given `type` event, passing the `data…` arguments to the listeners.

### `o.dispatch(cb)`

creates a dispatches that, for each change in the current call-stack, notifies
`cb(changes)` with an object containing all new changes.

### `o.stopDispatch([cb])`

stops dispatching to `cb` if set, otherwise removes all dispatches.

## events

* `change` : when any change occurs
* `add` : when the change is an addition
* `remove` : when the change is an deletion

**NOTE** : changes are fired by the `.set` and `.remove` methods.

## example

```javascript
var observable = require("bloody-observable")
var status = observable
  .extend({
    getDefaults : function(){
      return {
        status : null,
        label : "yo"
      }
    }
  })
  .create({
    status : 1
  })
status.on("change", function(changes){
  ui.update({
    status : changes.value
  })
})
status.dispatch(function(){

})
request.post("connect/", data)
  .then(function(xhr){
    status.set("status", JSON.parse(xhr.responseText).status)
  })
  .catch(function(){
    status.set("status", 0)
  })
```
