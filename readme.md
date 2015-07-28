# Backbone.js TodoMVC Example with Delay

This example was copied from https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone

We add [Sinon.js](http://sinonjs.org/) to simulate a delay
in responding.

**Why?**

Building client-side apps with the likes of Backbone.js
should be done without a server during the prototyping phase.

During prototyping, a "fake" server can be created that will
process GET/PUT/DELETE/POST REST calls.  Using Sinon,
we can delay the response by 900 ms... simulating
a slow Internet connection:

````
    // create mock server
    var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.autoRespondAfter = 900; // simulate 900ms delay
````

And then process the request:

````
    function processRequest(x, y) {
        if ('GET' === x.method) {
            x.respond(200,
                      {'Content-Type': 'application/json'},
                      JSON.stringify(getDatabase())
                     );
        } else if ('PUT' === x.method) {
            var id = parseInt(y.substring(1));
            var item = JSON.parse(x.requestBody);
            database[id] = item;

            x.respond(200,
                      {'Content-Type': 'application/json'},
                      JSON.stringify(item)
                     );
        } else if ('DELETE' === x.method) {
            var id = parseInt(y.substring(1));
            delete database[id];

            x.respond(200,
                      {'Content-Type': 'application/json'},
                      JSON.stringify(true)
                     );

        } else if ('POST' === x.method) {
            var item = JSON.parse(x.requestBody);
            item.id = item.order;
            database[item.order] = item;
            x.respond(200,
                      {'Content-Type': 'application/json'},
                      JSON.stringify(item)
                     );
        } else {
            throw "Don't know how to process: "+x.method;
        }
    }
````

You can also define the [JSON Schema](http://json-schema.org/)
of the request and response. That become both documentation
and something that can be used to test:

````
    // define the schema returned from the API call
    var responseSchema = {
    "title": "A todo item",
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "The title of the to-do item"
        },
        "completed": {
            "type": "boolean",
            "description": "Has the item been completed"
        },
        "order": {
            "type": "integer",
            "description": "The order to of the to-do item"
        }
    },
    "required": ["title", "order"]
    };
````

Taken together (all local mocked HTTP request and
JSON Schema), a client side developer can create a
mock app, define all the APIs, and define the shape
of the data exchanged via the APIs without
involving a server-side developer. This means
very, very fast prototyping as well as a complete
spec for the server-side developer (JSON Schema and
REST endpoints.)


## The original part of the README:




> Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

> _[Backbone.js - backbonejs.org](http://backbonejs.org)_


## Learning Backbone.js

The [Backbone.js website](http://backbonejs.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Annotated source code](http://backbonejs.org/docs/backbone.html)
* [Applications built with Backbone.js](http://backbonejs.org/#examples)
* [FAQ](http://backbonejs.org/#faq)

Articles and guides from the community:

* [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals)
* [Collection of tutorials, blog posts, and example sites](https://github.com/documentcloud/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites)

Get help from other Backbone.js users:

* [Backbone.js on StackOverflow](http://stackoverflow.com/questions/tagged/backbone.js)
* [Google Groups mailing list](https://groups.google.com/forum/#!forum/backbonejs)
* [Backbone.js on Twitter](http://twitter.com/documentcloud)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._
