define([
    'dojo/text!../htmlTemplate/dashboard.html',

    'dojo/on',
    'dojo/parser',

    'dojo/dom-construct',

    'dijit/registry',

    'dijit/layout/AccordionContainer',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'ready!'
], function(
    template,
    on, parser,
    domConstruct,
    registry
) {
    var module = {
        init: function() {
            domConstruct.place(template, 'appContent');

            parser.parse(registry.byId('appContent').domNode).then(function() {
                // module.registerModuleEvent();
            });
        }
    };

    return module;
});