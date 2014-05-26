var inquirer = require('inquirer');
var eztv = require('eztv');
var episodeMatcher = require('episode');

function getShows(query, callback) {
    eztv.getShows({ query: query }, function (err, results) {
        if (err) {
            callback(err);
            return false;
        }

        if (results.length === 0) {
            // No results
            callback(new Error('No shows found: ' + query));
            return false;
        }

        if (results.length === 1) {
            callback(undefined, results.pop());
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
                callback(undefined, answers.show);
            });
        }
    });
}


module.exports = function (query, callback) {
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

    getShows(query, function (err, show) {
        if (err) {
            callback(err);
            return;
        }

        eztv.getShowEpisodes(show.id, function (err, results) {
            if (err) {
                callback(err);
                return;
            }

            if (results.episodes.length === 0) {
                callback(new Error('No episodes found for "' + show.title + '"'));
            }

            var episodes,
                latestEpisode;

            if (latest) {
                results.episodes.forEach(function (item) {
                    if (!latestEpisode) {
                        latestEpisode = item;
                    }

                    if (item.seasonNumber > latestEpisode.seasonNumber && item.episodeNumber > latestEpisode.episodeNumber) {
                        latestEpisode = item;
                    }
                });

                callback(undefined, latestEpisode);
                return;
            } else {
                episodes = results.episodes.filter(function (item) {
                    if (season && episode) {
                        return season === item.seasonNumber && episode === item.episodeNumber;
                    }

                    if (season) {
                        return item.seasonNumber === season;
                    }

                    if (episode) {
                        return item.episodeNumber === episode;
                    }

                    return true;
                });
            }


            if (episodes.length === 0) {
                callback(new Error('No episodes found for "' + show.title + '", Season ' + season + ', Episode ' + episode));
                return;
            }

            if (episodes.length === 1) {
                callback(undefined, episodes.pop());
                return;
            }

            inquirer.prompt([{
                type: 'list',
                message: 'There are multiple episodes matching your query',
                choices: episodes.map(function (episode) {
                    return {
                        name: episode.seasonNumber + 'x' + episode.episodeNumber + ': ' + episode.title,
                        value: episode
                    };
                }),
                name: 'episode'
            }], function (answers) {
                callback(undefined, answers.episode);
            });
        });
    });

};
