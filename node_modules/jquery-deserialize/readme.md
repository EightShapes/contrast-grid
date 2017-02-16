# jQuery.deserialize

    $("form").deserialize(data[, options]);

Decodes serialized form data and populates the form with that data. This method works upon text strings in standard URL-encoded notation, arrays containing objects of name/value pairs or objects containing name/value pairs. Thus, the plugin is compatibile with the data collected using the following methods:

* [jQuery.serialize()](http://api.jquery.com/serialize)
* [jQuery.serializeArray()](http://api.jquery.com/serializeArray)
* [jQuery.serializeObject()](http://benalman.com/projects/jquery-misc-plugins/#serializeobject) (unofficial)

## Install

Download as [NPM](http://npmjs.org) module:

    npm install jquery-deserialize

Download as [Bower](http://bower.io) component:

    bower install jquery-deserialize

## Example

Populate a form on page load using query string parameters:

```javascript
jQuery(function( $ ) {
    $( 'form' ).deserialize( location.search.substr( 1 ) );
});
```

## Arguments

The plugin accepts two arguments: _data_ and _options_, the latter being optional. Passing the _complete()_ function as the second argument to this plugin is also supported.

* **data** _String_, _Array_, _Object_ A serialized (and/or encoded) String, an Array of objects containing name/value pairs, or an object of name/value pairs.
* **options** _Object_ An object of key/value pairs that configure the plugin.
    *    **change** _Function_ Called for every changed input value.
    *    **complete** _Function_ Called when all of the inputs have been updated.

## Requirements

jQuery.deserialize requires:

* jQuery version 1.4.3+ ([A patch is available](https://github.com/kflorence/misc-js/raw/master/jquery/patches/jquery.type-patch.js) for versions 1.2+).

## License

Copyright (c) 2015 Kyle Florence  
jQuery.deserialize is dual licensed under MIT and GPLv2 licenses.
