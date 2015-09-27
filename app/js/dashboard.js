define([
    'dojo/text!../htmlTemplate/dashboard.html',

    'dojo/on',
    'dojo/parser',

    'dojo/dom-construct',

    'dijit/registry',

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
            var content = registry.byId('appContent');
            content.destroyDescendants();
            domConstruct.place(template, content.containerNode);

            parser.parse(content.domNode).then(function() {
                // module.registerModuleEvent();
            });
        }
    };

    return module;
});