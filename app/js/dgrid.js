define([
    'dojo/text!../htmlTemplate/dgrid.html',

    'dojo/_base/declare',

    'dojo/Deferred',
    'dojo/on',
    'dojo/parser',

    'dojo/dom',
    'dojo/dom-construct',

    'dijit/registry',

    'dgrid/Grid',
    'dgrid/OnDemandGrid',
    'dgrid/Keyboard',
    'dgrid/Selection',

    'dstore/Memory',
    'dstore/RequestMemory',

    'dijit/layout/ContentPane',
    'ready!'
], function(
    template,
    declare,
    Deferred, on, parser,
    dom, domConstruct,
    registry,
    Grid, OnDemandGrid, Keyboard, Selection,
    Memory, RequestMemory
) {
    var module = {
        init: function() {
            var content = registry.byId('appContent');
            content.destroyDescendants();
            domConstruct.place(template, content.containerNode);

            parser.parse(content.domNode).then(function() {
                // module.registerModuleEvent();
                module.initBasicGrid();
                module.initOnDemandGrid();
            });
        },

        initBasicGrid: function() {
            var data = [
                { first: 'Bob', last: 'Barker', age: 89 },
                { first: 'Vanna', last: 'White', age: 55 },
                { first: 'Pat', last: 'Sajak', age: 65 }
            ];

            // Create a new constructor by mixing in the components
            var BasicGrid = declare([ Grid, Keyboard, Selection ]);

            // Now, create an instance of our custom grid which
            // have the features we added!
            var grid = new BasicGrid({
                className: 'dgrid-autoheight',
                columns: {
                    first: 'First Name',
                    last: 'Last Name',
                    age: 'Age'
                },
                // for Selection; only select a single row at a time
                selectionMode: 'single',
                // for Keyboard; allow only row-level keyboard navigation
                cellNavigation: false
            }, 'basicGrid');

            grid.renderArray(data);

            grid.on('dgrid-select', function (event) {
                // Report the item from the selected row to the console.
                console.log('Row selected: ', event.rows[0].data);
            });

            grid.on('dgrid-deselect', function (event) {
                console.log('Row de-selected: ', event.rows[0].data);
            });

            grid.on('.dgrid-row:click', function (event) {
                var row = grid.row(event);
                console.log('Row clicked:', row.id);
            });
        },

        initOnDemandGrid: function() {
            function causeError() {
                var dfd = new Deferred();
                dfd.reject('An error occurred while retrieving data.');
                return dfd.promise;
            }

            var defaultStore = new RequestMemory({
                    target: 'file://'+location.pathname.replace(/\/[^/]*$/, '')+'/app/js/sample.json'
                });

            var emptyStore = new RequestMemory({
                    target: 'file://'+location.pathname.replace(/\/[^/]*$/, '')+'/app/js/empty.json'
                });

            var errorStore = new Memory({
                    fetch: causeError,
                    fetchRange: causeError
                });

            var messageNode = dom.byId('errorMessage'),
                defaultButton = dom.byId('defaultStore'),
                emptyButton = dom.byId('emptyStore'),
                errorButton = dom.byId('errorStore');

            // Create an instance of OnDemandGrid referencing the store
            var grid = new OnDemandGrid({
                collection: defaultStore,
                columns: [
                    { field:'first', label: 'First Name' },
                    { field:'last', label: 'Last Name' },
                    { field:'totalG', label: 'Games Played' },
                    { field:'birthDate', label: 'Birth Date (unsortable)',
                      sortable: false }
                ],
                loadingMessage: 'Loading data...',
                noDataMessage: 'No results found.'
            }, 'ondemandGrid');

            grid.on('dgrid-error', function(event) {
                // Display an error message above the grid when an error occurs.
                messageNode.innerHTML = event.error.message;
                messageNode.className = '';
            });

            grid.on('dgrid-refresh-complete', function(event) {
                // Hide any previous error message when a refresh completes successfully.
                messageNode.innerHTML = '';
                messageNode.className = 'hidden';
            });

            on(defaultButton, 'click', function() {
                // grid.set('collection', grid.get('collection') === store ? errorStore : store);
                grid.set('collection', defaultStore);
            });

            on(emptyButton, 'click', function() {
                grid.set('collection', emptyStore);
            });

            on(errorButton, 'click', function() {
                grid.set('collection', errorStore);
            });

            grid.startup();
        }
    };

    return module;
});