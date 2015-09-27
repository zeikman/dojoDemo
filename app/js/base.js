define([
    'dojo/text!../htmlTemplate/base.html',

    'dojo/hash',
    'dojo/on',
    'dojo/parser',
    'dojo/topic',

    'dojo/dom',
    'dojo/dom-attr',
    'dojo/dom-construct',

    'dijit/registry',

    'app/js/dashboard',

    'dojo/query',
    'dijit/layout/AccordionContainer',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'ready!'
], function(
    template,
    hash, on, parser, topic,
    dom, domAttr, domConstruct,
    registry,
    dashboard
) {
    var module = {
        init: function() {
            domConstruct.place(template, document.body);

            parser.parse(document.body).then(function() {
                module.registerModuleEvent();
            });
        },

        registerModuleEvent: function() {
            var func = {
                onAppHeaderClick: function() {
                    window.alert('Hello, I am header !');
                },
                onMenuClick: function(event) {
                    // prevent loading a new page - we're doing a single page app
                    event.preventDefault();

                    var _module = domAttr.get(this, 'href').replace('.html', '');

                    func._loadModule(_module);
                },
                _loadModule: function(requireModule) {
                    if (requireModule == 'index') {
                        requireModule = 'dashboard';
                    }

                    hash(prefix+requireModule);

                    // get the page content using dojo require
                    require(['app/js/'+requireModule], function(requireModule) {
                        // initialize module
                        requireModule.init();
                    });
                },
                user: function(event) {
                    event.stopPropagation();
                    window.alert('User');
                },
                settings: function(event) {
                    event.stopPropagation();
                    window.alert('Settings');
                },
                logout: function(event) {
                    event.stopPropagation();
                    window.alert('Logout');
                }
            };
            var prefix = '!',
                // store the last requested page so we do not make multiple requests for the same content
                lastPage = (/([^\/]+).html$/.exec(location.pathname) || [])[1] || 'dashboard';

            on(registry.byId('appHeader'), 'click', func.onAppHeaderClick);
            on(dom.byId('menu'), 'a:click', func.onMenuClick);
            on(dom.byId('user'), 'click', func.user);
            on(dom.byId('settings'), 'click', func.settings);
            on(dom.byId('logout'), 'click', func.logout);

            topic.subscribe('/dojo/hashchange', function(newHash) {
                // parse the plain hash value, e.g. "index" from "!index"
                func._loadModule(newHash.substr(prefix.length));
            });

            if (location.hash.length == 0) {
                // set the default page hash
                hash(prefix+(location.hash || lastPage), true);
            }
            else {
                // load respective {hash} module
                var hashModule = location.hash.slice(0);

                func._loadModule(hashModule.substr('#'.length+prefix.length), 'nohash');
            }
        }
    };

    module.init();

    return module;
});