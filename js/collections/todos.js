/* global Backbone thing */
var app = app || {};

(function () {
    'use strict';

    var database = {1: {title: "Shave the Yak",
                        order: 1,
                        completed: false}};

    function getDatabase() {
        var ret = [];
        for (var i in database) {
            ret.push(database[i]);
        }
        return ret;
    }

    // create mock server
    var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.autoRespondAfter = 900; // simulate 900ms delay

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

    server.respondWith(/\api\/todos(.*)/, processRequest);



    // Todo Collection
    // ---------------

    var Todos = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: app.Todo,

        url: "/api/todos",

        // Filter down the list of all todo items that are finished.
        completed: function () {
            return this.where({completed: true});
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function () {
            return this.where({completed: false});
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function () {
            return this.length ? this.last().get('order') + 1 : 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'
    });

    // Create our global collection of **Todos**.
    app.todos = new Todos();

})();
