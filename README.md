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

### `observable.extend(object) > subclass`

creates an observable subclass.

### `observable.create([data={}]) > instance`

creates a new observable instance.
optionally takes a `data` argument (which, if set, must be an object).
if not set, `data` is a new empty `object`.

### `observable#get(key)`

returns the value for `key`.

### `observable#set(key, value)`

sets `value` as value for `key`.

### `observable#remove(key)`

removes the value for `key`

### `observable#toString()`

returns the JSON string of the observable data.

### `observable#valueOf()`

returns the observable data.

### `observable#listen(type, listener)`

listens the the `type` event and attaches `listener` to it.

### `observable#stopListening([type[, listener]])`

stops listening :

- if no argument is set : all events
- if `type` is set : all `type` events
- if `type` and `listener` are set : the `listener` for this `type`

### `observable#fire(type[, data…])`

fires the given `type` event, passing the `data…` arguments to the listeners.

## events

* `change` : when any change occurs
* `add` : when the change is an addition
* `remove` : when the change is an deletion

**NOTE** : changes are fired by the `.set` and `.remove` methods.
