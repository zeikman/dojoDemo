define([
    'dojo/text!../htmlTemplate/report.html',

    'dojo/parser',

    'dojo/dom-construct',

    'dijit/registry',

    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/layout/TabContainer',
    'ready!'
], function(
    template,
    parser,
    domConstruct,
    registry
) {
    var module = {
        init: function() {
            var content = registry.byId('appContent');
            content.destroyDescendants();
            domConstruct.place(template, content.containerNode);

            parser.parse(content.domNode).then(function() {
                content.resize();
            });
        }
    };

    return module;
});