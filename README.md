Eztv-query
==========
[![NPM version](https://badge.fury.io/js/eztv-query.png)](http://badge.fury.io/js/eztv-query)
[![Dependency Status](https://david-dm.org/Munter/etv-query.png)](https://david-dm.org/Munter/etv-query)

Query the eztv website for information about a specific TV-series episode.

Takes a free text query string, tries to pull out any specific season and episode search an queries the eztv website using [eztv](https://github.com/moesalih/node-eztv).

If there are multiple results from the queries on a series name or season/episode it will prompt the user in the console to select only one of the options.

Returns a magnet link.

Usage
-----
```
var eztvQuery = require('eztv-query');

eztvQuery('house of cards season 2 episode 5', function (err, episode) {
    console.log(episode);
});

// Console output:
'magnet:?xt=urn:btih:GR7EZAADH6BJG43TLSN2O4YCTDFCKURW&dn=House.of.Cards.2013.S02E05.WEBRip.x264-2HD&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.istole.it:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80'
```

For an example on creating a command line search interface, see the [eztv executable](https://github.com/Munter/eztv-query/blob/master/bin/eztv).

Query syntax
------------
Eztv-query tries to give you a human friendly free text query syntax.

Etv-query will try to figure out what specific season and episode you are looking for by matching any [episode syntax](https://github.com/Munter/episode#supported-syntaxes) in your query string. In addition, having `latest` anywhere in your query will automatically default to the latest aired episode.

The rest of the query string is passed on to find the series in question.

Examples:

`eztv-query big`: Lists all possible matching shows and queries user to select one. Then queries user to select an episode. Returns the selected episode.

`eztv-query downton abbey`: Lists all seasons and episodes and queries the user to select one. Returns the selected episode.

`eztv-query game of thrones season 5`: Lists all episodes in season 5 and queries the user to select one. Returns the selected episode.

`eztv-query west wing 5x10`: Returns season 5 episode 10.

`eztv-query latest big bang theory`: Returns the latest episode (highest season and episode number).


License
-------
(The MIT License)

Copyright (c) 2014 Peter Müller <munter@fumle.dk>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
