var twitter = require("twitter");
var appexp = require("express"); 
var request = require("request");//omdb
var spotify = require("node-spotify-api");
var fs = require("fs");

var nodeArg = process.argv;
var liriCommand = process.argv[2];

// console.log(t);
// console.log(s);

// accessing Twitter - it works
// last 20 tweets & when they were created

function myTweets(){
	var keys = require("./keys.js");
  var t = new twitter(keys);

  t.get('search/tweets', {q: 'aireEspinoza', count: 20}, function(error, tweet, response){
    if(error){
      console.log(error);
      return;

    }else{

    var tweet = tweet.statuses

    	// console.log(tweet);

    for (var i = 0; i < tweet.length; i++) {
    console.log("================================");
    console.log(tweet[i].text);
    console.log(tweet[i].created_at);
        
      var tweetObject = {text: tweet[i].text, created: tweet[i].created_at};
      fs.appendFileSync("log.txt", JSON.stringify(tweetObject, null, 2));;
      }    
    }
  });
};

// myTweets();

function spotifyThisSong() {
	
  var keys2 = require("./keysspot.js")
  var s = new spotify(keys2);

	//create way for system to default to "the sign" song if nothing is entered on command line
  var searchTitle;

  if (process.argv[3] === " " || process.argv[3] === undefined){

    searchTitle = "The Sign";

  } else {

    searchTitle = process.argv[3];

  };
    // console.log(searchTitle);
   	
//search spotify for a specific track or the default
	s.search({
    type: 'track',
    query: searchTitle,
    limit: 10
     
  }, function(err, data) {
  		if (err){
          
      console.log('Error occurred: ' + err);
      return;

    } else {

      // console.log("hello")
      // console.log(data.tracks.items)

     	//creat a loop to go through all of the songs

			for (var i = 0; i < data.tracks.items.length; i++) {
        // console.log("hello2", JSON.stringify(data.tracks.items[0]))

        var songInfo = data.tracks.items[i];
        // console.log("hello3", songInfo.artists)
        var artist = songInfo.artists[0].name;
        var album = songInfo.album.name;
        var songName = songInfo.name;
        var songURL = songInfo.preview_url;
          console.log("================================");
          console.log(artist);
          console.log(songName);
          console.log(songURL);
          console.log(album);
       //create a variable that holds all of the data so it can go into a file       
      var dataObject = {Artist: artist, Song: songName, Preview: songURL, Album: album};
      //put data into a file        
      fs.appendFileSync("log.txt", JSON.stringify(dataObject, null, 2));;
      
      }
    	}
    }
  )
};
 // spotifyThisSong();	

//accessing OMDB to get information about a moview

function movieThis(){

// Grab or assemble the movie name and store it in a variable called "movieName"

var movieName;

  if (process.argv[3] === " " || process.argv[3] === undefined){

    movieName = "Mr.Nobody";

  } else {

    movieName = process.argv[3];

  };

// console.log(movieName);
// Then run a request to the OMDB API with the movie name specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=8ed601e1";


// This line is just to help us debug against the actual URL.
// console.log(queryUrl);

// Then create a request to the queryUrl

request(queryUrl, function(error, response, body){
  // console.log(response)

  if(error){
    console.log('Error occurred: ' + error);
     return;
  }

    // console.log("hello")
    // console.log(movieName)
    // console.log("hello2", JSON.stringify(body))
    // console.log("hello3", JSON.parse(body))

    var movieInfo = JSON.parse(body)
    // console.log("hello4", movieInfo.Title)

    var title = movieInfo.Title;
    var year = movieInfo.Year;
    var rating = movieInfo.Ratings;
    var imdbRating = rating[0].Source.Value;
    var rottenTomsRating = rating[1].Source.Value;
    var countryProduction = movieInfo.Country;
    var language = movieInfo.Language;
    var plot = movieInfo.Plot;
    var actors = movieInfo.Actors;
      console.log("================================");
      console.log(title);
      console.log(year);
      console.log(imdbRating);
      console.log(rottenTomsRating);
      console.log(countryProduction);
      console.log(language);
      console.log(plot);
      console.log(actors);
      console.log("================================")
        //create a variable that holds all of the data so it can go into a file       
    var dataMovie = {"Title": title, "Year": year, "IMDB Rating": imdbRating,"Rotten Tommatos Rating": rottenTomsRating, 'Country of Production': countryProduction, "Language": language, "Plot": plot, "Actors": actors};
        //put data into a file    
      // console.log(dataMovie)    
    fs.appendFileSync("log.txt", JSON.stringify(dataMovie, null, 2));;
  
  })
};
// movieThis();

function randomPick() {
  fs.readFile("random.txt", "UTF-8", function(error, data){
    if (error){
      console.log(error);
    }else{
      console.log(data);

    }
  })

};
// randomPick();



// create the liri commands
switch(liriCommand) {
    case "my-tweets":
    myTweets();
    break;

    case "spotify-this-song":
    spotifyThisSong();
    break;

    case "movie-this":
    movieThis();
    break;

    case "do-what-it-says":
    randomPick();
    break;

    default:
    console.log("It won't work if you don't enter a command.  Have a nice day.");
    break;
};