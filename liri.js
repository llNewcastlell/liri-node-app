var fs = require('fs')
require('dotenv').config();
const NewsAPI = require('newsapi');
const keys = require('./keys.js')
const request = require("request");
// console.log(keys);
const newsapi = new NewsAPI("470fb741f41f48e689b4e2f86648526c");
// Spotify API
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

function songSearch(song) {
    if (!song) {
        song = "The Sign";
        // artist = "Ace of Bass";
    }
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview: " + data.tracks.items[0].external_urls.spotify);

    });
}

function movieSearch(title) {

    if (!title) {
        title = "Mr. Nobody";
    }
    request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title of the Film: " + JSON.parse(body).Title);
            console.log("Year the film was released: " + JSON.parse(body).Year);
            console.log("Rating of the film: " + JSON.parse(body).Rated);
            console.log("Rotten Tomatoes film quality rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Nation in which the film was produced: " + JSON.parse(body).Country);
            console.log("Language in which the film is available: " + JSON.parse(body).Language);
            console.log("Plot of the film: " + JSON.parse(body).Plot);
            console.log("Actors and actresses in the film: " + JSON.parse(body).Actors)
        }
    })
}



function news(headline) {
    // var headline = process.argv[2];
    if (!headline) {
        headline === "Barrack Obama"
    }
    newsapi.v2.everything({
        q: headline,
        sources: 'bbc-news,the-verge',
        domains: 'bbc.co.uk, techcrunch.com',
        from: '2017-12-01',
        to: '2017-12-12',
        language: 'en',
        sortBy: 'relevancy',
        page: 2,
        pageSize: 20
    }).then(response => {
        for (i = 0; i < 21; i++) {
            console.log("_______________________________________________________________________________________________________________________________");
            console.log("Title: " + (response).articles[i].title);
            console.log("Author: " + (response).articles[i].author);
            console.log("Date of Publication: " + (response).articles[i].publishedAt);
            console.log("URL to full article: " + (response).articles[i].url);
            console.log("_______________________________________________________________________________________________________________________________");
            // console.log("Title: " + (response).articles[1].title);
            // console.log("Author: " + (response).articles[1].author);
            // console.log("Date of Publication: " + (response).articles[1].publishedAt);
            // console.log("URL to full article: " + (response).articles[1].url);
        }
    });
}


function handleUserRequest(userCommand, userSearch) {
    switch (userCommand) {
        case "spotify-this-song":
            songSearch(userSearch)
            break;

        case "movie-this":
            movieSearch(userSearch)
            break;

        case "my-news":
            news(userSearch)
            break;

        case "do-what-it-says":

            doWhat()
            break;

        default:
            console.log("Please enter a valid command.");
            break;
    }
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        // console.log(data)
        var searchArray = data.split(",");
        handleUserRequest(searchArray[0], searchArray[1]);
        // console.log(searchArray);
    })
}

function getSearchString(array) {
    var searchTerm = "";
    for (var i = 3; i < array.length; i++) {
        searchTerm += " " + array[i]
    }
    return searchTerm;
}

handleUserRequest(process.argv[2], getSearchString(process.argv));