var inquirer = require('inquirer');
var eztv = require('eztv-search');
var episodeMatcher = require('episode');
var rsvp = require('rsvp');

module.exports = function (query) {
    if (!query) {
        callback(new Error('No search query specified'));
    }

    var foundMatches = episodeMatcher(query),
        season = foundMatches.season,
        episode = foundMatches.episode,
        latest = false;

    foundMatches.matches.forEach(function (match) {
        query = query.replace(match, '');
    });

    if (query.match(/\blatest\b/i)) {
        latest = true;
        query = query.replace('latest', '');
    }

    query = query.replace(/ +/, ' ').trim();

    function selectShow(results) {
        return new rsvp.Promise(function (resolve, reject) {
            if (results.length === 0) {
                return reject(new Error('No shows found: ' + query));
            }

            if (results.length === 1) {
                resolve(results.pop());
            } else {
                inquirer.prompt([{
                    type: 'list',
                    message: 'There are multiple shows matching your query',
                    choices: results.map(function (show) {
                        return {
                            name: show.title,
                            value: show
                        };
                    }),
                    name: 'show'
                }], function (answers) {
                    resolve(answers.show);
                });
            }
        });
    }

    function selectEpisode(show) {
        return new rsvp.Promise(function (resolve, reject) {
            if (show.episodes.length === 0) {
                return reject(new Error('No episodes found for "' + show.title + '"'));
            }

            var episodes,
                latestEpisode;

            if (latest) {
                show.episodes.forEach(function (item) {
                    if (!latestEpisode) {
                        latestEpisode = item;
                    }

                    if (item.season > latestEpisode.season && item.episode > latestEpisode.episode) {
                        latestEpisode = item;
                    }
                });

                return resolve(latestEpisode);
            } else {
                episodes = show.episodes.filter(function (item) {
                    if (season && episode) {
                        return season === item.season && episode === item.episode;
                    }

                    if (season) {
                        return item.season === season;
                    }

                    if (episode) {
                        return item.episode === episode;
                    }

                    return true;
                });
            }


            if (episodes.length === 0) {
                return reject(new Error('No episodes found for "' + show.title + '", Season ' + season + ', Episode ' + episode));
            }

            if (episodes.length === 1) {
                return resolve(episodes.pop());
            }

            inquirer.prompt([{
                type: 'list',
                message: 'There are multiple episodes matching your query',
                choices: episodes.map(function (episode) {
                    return {
                        name: episode.season + 'x' + episode.episode + ': ' + episode.title,
                        value: episode
                    };
                }),
                name: 'episode'
            }], function (answers) {
                resolve(answers.episode);
            });
        });
    }

    return eztv.series(query, 1)
        .then(selectShow)
        .then(function (show) {
            return show.imdb_id;
        })
        .then(eztv.episodes)
        .then(selectEpisode)
        .then(function (episode) {
            return episode.torrents[0].url;
        })
};
