define([
    'dojo/text!../htmlTemplate/base.html',

    'dojo/on',
    'dojo/parser',

    'dojo/dom-construct',

    'dijit/registry',

    'app/js/dashboard',

    'dijit/layout/AccordionContainer',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'ready!'
], function(
    template,
    on, parser,
    domConstruct,
    registry,
    dashboard
) {
    var module = {
        init: function() {
            domConstruct.place(template, document.body);

            parser.parse(document.body).then(function() {
                module.registerModuleEvent();
            }).then(function() {
                dashboard.init();
            });
        },

        registerModuleEvent: function() {
            var func = {
                onAppHeaderClick: function() {
                    window.alert('Hello, I am header!');
                }
            };

            on(registry.byId('appHeader'), 'click', func.onAppHeaderClick);
        },

        loadModule: function() {}
    };

    module.init();

    return module;
});