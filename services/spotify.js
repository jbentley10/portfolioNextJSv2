/**
 * @file spotify.js
 * Main entry point allowing access to the Spotify API
 * @file /services/spotify.js
 * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/
 */
import { invariant, warning } from "hey-listen";
import { parseCookies } from "nookies";
import SpotifyWebApi from "spotify-web-api-node";
import whereami from '@layerframers/whereami'

import {
  generalPlaylistImageBase64,
  singAlongTrackIds,
  genreMatrix,
  ultimateSongMatrix
} from "../constants/playlistConstants";

const apiEndpoint = "https://api.spotify.com/v1";
const accountEndpoint = "https://accounts.spotify.com/api";

// refresh the credentials every 59 minutes
const CLIENT_CRED_REFRESH = 3600 * 1000 - 1000;

// setInterval(refreshAccessToken, CLIENT_CRED_REFRESH)

let redirectUri = process.env.SPOTIFY_DEV_REDIRECT_URI || 'http://localhost'
if (!whereami.isLocal) {
  try {
    const isStaging = whereami.isStaging
    console.log('Spotify service using staging redirect url?', isStaging)
    redirectUri = isStaging ? process.env.SPOTIFY_STAGING_REDIRECT_URI : process.env.SPOTIFY_REDIRECT_URI
  } catch (err) {
    console.log('There was an error setting the staging redirect uri', err)
  }
}

console.log('Using auth redirect uri', redirectUri)

// Initial config vars
const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

var startingTrackList = [];
var answers = [];
var tripDuration = 0;
var playlistId = "";
var doPause = false;
var pauseDuration = 1000;

/**
 * base64Encode
 * Handles encoding accessToken to base64
 * @param {string} val
 * @return {string}
 */
const base64Encode = val => new Buffer.from(val).toString("base64");

/**
 * checkStatus
 * @param {*} response
 */
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  invariant(false, `HTTP Error ${response.statusText}`);
  throw error;
};

export default {
  /**
   * api
   * Make the wrapper public.
   */
  api: spotifyApi,

  /**
   * authorizeUrl
   * Kicks off the whole auth flow. The auth code is needed to get
   * the token, that's used for future API requests
   */
  authorizeUrl: spotifyApi.createAuthorizeURL(process.env.SPOTIFY_API_SCOPES),

  /**
   * refreshTheAccessTokens
   * Handles fetching and setting a new access token
   * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-flows
   */
  refreshTheAccessTokens: async function() {
    try {
      const accessToken = spotifyApi.getAccessToken();
      const data = await spotifyApi.refreshAccessToken();
      const { body } = data;
      const { expires_in: expiresIn, access_token: nAccessToken } = body;
      warning(accessToken, "Unable to find an access token");
      warning(expiresIn, "Unable to find a expiration time");

      // Set the new access token
      spotifyApi.setAccessToken(nAccessToken);

      return {
        expiresIn,
        accessToken: nAccessToken
      };
    } catch (err) {
      console.log(
        "Something went wrong when refreshing the Spotify token.",
        err
      );
      return {
        expiresIn: undefined,
        accessToken: undefined,
        error: err
      };
    }
  },

  /**
   * init
   * Handles initializing the api and logging in the user if
   * cookies are found to do so
   * @param {string} accessToken
   * @param {string} refreshToken
   * @return {bool}
   */
  init: (accessToken, refreshToken) => {
    console.log("Initializing the Layerframe Spotify Service");
    try {
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);
      return true;
    } catch (err) {
      warning(false, "There was an error intializing the Spotify service.");
      invariant(err);
      return err;
    }
  },

  /**
   * getUserProfile
   * Handles fetching the user profile from Spotify
   */
  getUserProfile: async function() {
    return await spotifyApi.getMe();
  },

  /**
   * setTokensFromCookies
   * Sets the Spotify API token and refresh token from the cookies
   * @param {object} cookies Parsed cookie object
   * @return {bool}
   */
  setTokensFromCookies: cookies => {
    try {
      const { SpotifyToken, SpotifyRefreshToken } = cookies;
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(SpotifyToken);
      spotifyApi.setRefreshToken(SpotifyRefreshToken);
      return true;
    } catch (err) {
      console.error(err);
      invariant(false, "There was an error setting the tokens from the cookie");
      return false;
    }
  },

  /**
   * getAccessToken
   * Handles getting an authorization token used for subsequent API requests.
   * @param string code The code returned after login
   * @return object
   */
  getAccessToken: async function(code) {
    invariant(code, "Umable to find a valid Spotify authorization code.");
    try {
      const data = await spotifyApi.authorizationCodeGrant(code);

      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);
      if (process.browser) {
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body["access_token"]);
        spotifyApi.setRefreshToken(data.body["refresh_token"]);
      }
      return {
        expiresIn: data.body["expires_in"],
        accessToken: data.body["access_token"],
        refreshToken: data.body["refresh_token"],
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong when getting the Spotify token.", err);
      return {
        expiresIn: undefined,
        accessToken: undefined,
        refreshToken: undefined,
        error: err
      };
    }
  },

  /**
   * createPlaylist
   * @param string name The name of the playlist
   * @param string duration The duration of the playlist, in ms
   * @param string pub Whether or not the playlist should be public
   * @return object
   */
  createPlaylist: async function(quizAnswers, duration, includeExplicit) {
    // Check the duration
    if (duration && duration.value) {
      tripDuration = duration.value *= 1000;
    }
    // try to fetch from localStorage
    if (!duration) {
      // get the duration of the playlist... for ease, changing to ms since Spotify track lengths are in ms
      tripDuration = JSON.parse(localStorage.getItem("duration")).value * 1000;
    }

    if (!tripDuration) {
      console.error("Unable to find the duration of the playlist.");
      return {
        tracks: false,
        error: "duration_missing"
      };
    }

    // TODO: Maybe refresh the token here, just in case.

    try {
      // Create a private playlist
      const postData = {
        name: "Soundtrack Your Ride",
        description:
          "This is a custom generated playlist from the Soundtrack your Ride.",
        public: true
      };

      var trackList,
        genreTracks,
        ultimateSongTracks,
        numberOfTracks,
        ultimateTrack,
        playlistCreated,
        numberOfTracksToLoad,
        currentPlaylistTime;

      if (Date.now() > parseInt(parseCookies()["SpotifyTokenExpiration"])) {
        // auth token expired... not getting the refresh token functionality working right now, so
        // just redirecting to the home page at this point
        return {
          tracks: undefined,
          error: "access_token"
        };
      }

      // keep track of the answers
      answers = quizAnswers;

      // start a timer to track how long this takes.. just for us to keep track of
      console.time("Time to compile playlist");

      // compile our starting track list (pulls in user tracks)
      trackList = await this.compileStartingTrackList();

      // keep track of our current playlist length (number of tracks)
      numberOfTracks = trackList.length;

      // keep track of our original list in case we need it
      startingTrackList = [...trackList];

      // check to see how many songs we should load (if we don't have enough in our starting playlist, we'll add more
      // genre and fav song tracks)
      currentPlaylistTime = this.getTotalPlaylistTime(startingTrackList);
      if (currentPlaylistTime < tripDuration * 2) {
        // current playlist time is less than 2x our trip length... need to add more
        // calculating number of tracks we need to add based on avg 4min song length (240000 ms)
        numberOfTracksToLoad = Math.ceil(((tripDuration * 2) - currentPlaylistTime) / 240000);
      } else {
        numberOfTracksToLoad = numberOfTracks;
      }

      // if we didn't select an "Ultimate Song", we're going to load twice as many from the genre
      if (!this.getQuestionAnswer(3))
        numberOfTracksToLoad = numberOfTracksToLoad * 2;

      // FAVORITE GENRE
      // we add in top tracks from the chosen genre
      genreTracks = await this.getGenreTracks(numberOfTracksToLoad);
      trackList = trackList.concat(genreTracks.tracks);

      // shuffle (twice just for fun)
      trackList = this.shufflePlaylist(trackList);
      trackList = this.shufflePlaylist(trackList);

      // ULTIMATE DRIVING SONG
      // we deal with the "ultimate song" question
      ultimateSongTracks = await this.getUltimateSongTracks(
        numberOfTracksToLoad
      );
      trackList = trackList.concat(ultimateSongTracks.tracks);

      // shuffle (twice just for fun)
      trackList = this.shufflePlaylist(trackList);
      trackList = this.shufflePlaylist(trackList);

      // console.log('tracklist length before drive vibe', trackList.length);

      // DRIVE VIBE AND RIDE PARTNER
      // deal with "drive vibe" and "who are you riding with?" questions
      trackList = await this.getDriveVibeAndRidePartners(trackList);
      trackList = trackList.tracks;

      // console.log('tracklist length after drive vibe', trackList.length);
      // console.log('tracklist', trackList);

      // Handle explicit flag
      if (!includeExplicit) {
        trackList = trackList.filter(track => track.explicit === false);
      }

      // check for an "ultimate song".. if present, add it to the beginning
      ultimateTrack = ultimateSongTracks.ultimateTrack;
      
      // remove duplicates from the list
      trackList = this.removeDuplicateTracks(trackList);

      // LASTLY, trim the playlist to the desired length
      trackList = this.trimPlaylist(
        trackList,
        tripDuration,
        this.getTotalPlaylistTime(trackList)
      );

      playlistCreated = await this.createSpotifyPlaylist(trackList, ultimateTrack);

      // stop the timer
      console.timeEnd("Time to compile playlist");

      return {
        tracks: trackList,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong generating playlist!", err);
      return {
        tracks: false,
        error: err
      };
    }
  },

  /**
   * compileStartingTrackList
   */
  compileStartingTrackList: async function() {
    try {
      var trackList,
        recentlyPlayedTracks,
        topTracks,
        libraryTracks,
        artistsFollowedTopTracks;

      // get recently played tracks
      recentlyPlayedTracks = await this.getRecentlyPlayedTracks();
      trackList = recentlyPlayedTracks.tracks;

      // get top tracks
      topTracks = await this.getMyTopTracks();
      trackList = trackList.concat(topTracks.tracks);

      // get saved tracks
      libraryTracks = await this.getMyLibraryTracks();
      trackList = trackList.concat(libraryTracks.tracks);

      // get top tracks from artists this user follows
      artistsFollowedTopTracks = await this.getFollowedArtistsTopTracks();
      trackList = trackList.concat(artistsFollowedTopTracks.tracks);

      // add track features that we want to include with our data
      trackList = await this.addTrackFeatures(trackList);

      // remove duplicates from the list
      trackList = this.removeDuplicateTracks(trackList);

      // shuffle the array ... needed here? not sure.. doing it anyway
      trackList = this.shufflePlaylist(trackList);

      return trackList;
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        results: undefined,
        error: err
      };
    }
  },

  /**
   * msToTime
   */
  msToTime: duration => {
    let num = duration / 1000;
    let minutes = Math.ceil(num / 60) % 60;
    let hours = Math.floor(num / 3600);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours} hrs ${minutes} min`;
  },

  /**
   * removeDuplicateTracks
   * Removes duplicate entries from our tracklist
   * @param array trackList
   * @return array
   */
  removeDuplicateTracks: trackList => {
    return trackList.filter(
      (track, index, self) => index === self.findIndex(t => t.id === track.id)
    );
  },

  /**
   * getTotalPlaylistTime
   * returns the total time of the playlist (in ms!!)
   * @param array trackList
   * @return number
   */
  getTotalPlaylistTime: trackList => {
    return trackList
      .map(track => track.duration_ms)
      .reduce((prev, next) => prev + next);
  },

  /**
   * trimPlaylist
   * trims the playlist to the desired playlist length (without going UNDER the desired length)
   * @param array trackList
   * @param number targetLength (length that you want the playlist trimmed to) - ms
   * @param number currentLength (current length of the playlist) - ms
   * @return array
   **/
  trimPlaylist: (trackList, targetLength, currentLength) => {
    var removedTrack = [];

    while (currentLength > targetLength) {
      removedTrack = trackList.pop();
      currentLength -= removedTrack.duration_ms;
    }

    // put the last one back on since we want to be slightly longer than the desired length
    trackList.push(removedTrack);

    return trackList;
  },

  /**
   * shufflePlaylist
   * Shuffles a playlist (based on Fisher-Yates algorithm)
   * @param array playlist
   * @return array
   **/
  shufflePlaylist: playlist => {
    var currentIndex = playlist.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = playlist[currentIndex];
      playlist[currentIndex] = playlist[randomIndex];
      playlist[randomIndex] = temporaryValue;
    }

    return playlist;
  },

  /**
   * addTrackFeatures
   * for each of the tracks in our track list, grab some audio features that we're going to use
   * Note - can only get 100 at a time
   * @param array trackList the list of tracks we've compiled
   */
  addTrackFeatures: async function(trackList) {
    var finalTrackList = [],
      trackIds,
      tempTrackIds = [],
      audioFeatures,
      newTrackObject = {},
      maxLoopNum,
      index = 0;

    // get list of trackIds from our tracklist
    trackIds = trackList.map(track => track.id);

    // can only grab features for 100 tracks at a time... so we split this into chunks if necessary

    while (trackIds.length > 0) {
      tempTrackIds =
        trackIds.length > 100
          ? trackIds.splice(0, 100)
          : trackIds.splice(0, trackIds.length);
      audioFeatures = await spotifyApi.getAudioFeaturesForTracks(tempTrackIds);
      audioFeatures = audioFeatures.body.audio_features;

      for (var j = 0; j < audioFeatures.length; j++) {
        const tFeature = audioFeatures[j];
        const { tempo, instrumentalness, energy, valence } = tFeature;
        const releaseDate = trackList[index].album.release_date;
        newTrackObject = {
          ...trackList[index],
          year: parseInt(releaseDate.substring(0, 4)),
          tempo,
          instrumentalness,
          energy,
          valence
        };
        finalTrackList.push(newTrackObject);
        index++;
      }
    }

    // return the new list of tracks with the added data
    return finalTrackList;
  },

  /**
   * getRecommendations
   * get a list of top tracks according to given search criteria
   * @param {Object} [options] The options supplied to this request.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @example getRecommendations({ min_energy: 0.4, seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'], min_popularity: 50 }).then(...)
   */

  getRecommendations: async function(options, limit) {
    try {
      const data = await spotifyApi.getRecommendations({
        ...options,
        limit: limit
      });

      return {
        tracks: data.body.tracks,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        data: undefined,
        error: err
      };
    }
  },

  /**
   * getQuestionAnswer
   * Get the value of the answer to the question number given
   * @param number questionNumber
   * @return string or null
   */
  getQuestionAnswer: questionNumber => {
    return answers[questionNumber] &&
      answers[questionNumber] !== "" &&
      answers[questionNumber] !== "skipped"
      ? answers[questionNumber]
      : null;
  },

  /**
   * getGenreTracks
   * Return tracks based on a certain genre (can only load 100 at a time)
   * If no genre is given, we're going to use the "Road Trip" genre
   * @param array trackList
   * @return array
   */
  getGenreTracks: async function(
    numberOfTracksToLoad,
    genre = undefined,
    min_popularity = undefined
  ) {
    try {
      const genreAnswer = this.getQuestionAnswer(1) || genre || "Road Trip";
      const popularity = min_popularity || 70;

      var spotifyGenre,
        genreTracks = [],
        limit;

      if (genreAnswer) {
        spotifyGenre = genreMatrix.find(item => item.title === genreAnswer)
          .genre;

        // load 100 tracks at a time... up until we've gotten to the total (numberOfTracksToLoad)
        while (numberOfTracksToLoad > 0) {
          limit = numberOfTracksToLoad < 100 ? numberOfTracksToLoad : 100;
          var newTracks = await this.getRecommendations(
            { seed_genres: [spotifyGenre], min_popularity: popularity },
            limit
          );
          newTracks = newTracks.tracks;
          newTracks = await this.addTrackFeatures(newTracks);
          genreTracks = genreTracks.concat(newTracks);
          numberOfTracksToLoad -= 100;
        }
      }

      return {
        tracks: genreTracks,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

  /**
   * getUltimateSongTracks
   * Return tracks based on our ultimate song (can only load 100 at a time)
   * @param array trackList
   * @return array
   */
  getUltimateSongTracks: async function(numberOfTracksToLoad) {
    try {
      const songAnswer = this.getQuestionAnswer(3);
      var ultimateTrackId,
        ultimateSongTracks = [],
        limit,
        ultimateTrack = undefined,
        ultimateTrackFeatures;

      if (songAnswer) {
        ultimateTrackId = ultimateSongMatrix.find(
          item => item.title === songAnswer
        ).trackId;

        // load 100 tracks at a time... up until we've gotten to the total (numberOfTracksToLoad)
        while (numberOfTracksToLoad > 0) {
          limit = numberOfTracksToLoad < 100 ? numberOfTracksToLoad : 100;
          var newTracks = await this.getRecommendations(
            { seed_tracks: [ultimateTrackId], min_popularity: 50 },
            limit
          );
          newTracks = newTracks.tracks;
          newTracks = await this.addTrackFeatures(newTracks);
          ultimateSongTracks = ultimateSongTracks.concat(newTracks);
          numberOfTracksToLoad -= 100;
        }

        // load the ultimate song
        ultimateTrack = await spotifyApi.getTrack(ultimateTrackId);
        ultimateTrack = ultimateTrack.body;
        ultimateTrackFeatures = await spotifyApi.getAudioFeaturesForTrack(
          ultimateTrackId
        );
        ultimateTrackFeatures = ultimateTrackFeatures.body;
        ultimateTrack = {
          ...ultimateTrack,
          tempo: ultimateTrackFeatures.tempo,
          instrumentalness: ultimateTrackFeatures.instrumentalness,
          energy: ultimateTrackFeatures.energy,
          valence: ultimateTrackFeatures.valence
        };
      }

      return {
        tracks: ultimateSongTracks,
        ultimateTrack: ultimateTrack,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        ultimateTrack: undefined,
        error: err
      };
    }
  },

  /**
   * getDriveVibeAndRidePartners
   * Filter / Add tracks based on Drive Vibe and People we're driving with
   * @param array trackList
   * @return array
   */
  getDriveVibeAndRidePartners: async function(trackList) {
    try {
      const vibeAnswer = this.getQuestionAnswer(2);
      const riderAnswer = this.getQuestionAnswer(0);

      if (vibeAnswer) {
        switch (vibeAnswer) {
          case "Mellow":
            trackList = trackList.filter(track => track.energy < 0.75);
            break;
          case "Sing-alongs":
            trackList = trackList.filter(track => track.instrumentalness < 0.5);

            if (riderAnswer && riderAnswer === "Friends") {
              // user selected 'sing along' and riding with 'friends'
              // we're going to make half of our tracks be "sing along" tracks

              var singAlongTrackList = [];
              for (var i = 0; i < singAlongTrackIds.length; i++) {
                singAlongTrackList.push({ id: singAlongTrackIds[i] });
              }

              trackList = trackList.splice(0, Math.floor(trackList.length / 2));
              trackList = trackList.concat(singAlongTrackList);

              // shuffle (twice just for fun)
              trackList = this.shufflePlaylist(trackList);
              trackList = this.shufflePlaylist(trackList);
            }
            break;
          case "High-energy":
            trackList = trackList.filter(track => track.energy > 0.25);
            break;
          case "Classic":
            trackList = trackList.filter(track => track.year < 2000);
            break;
          case "Love sick":
            if (riderAnswer && riderAnswer === "Partner") {
              // user selected 'love sick' and riding with 'partner'
              // we're going to make half of our tracks be from the 'romance' category

              trackList = trackList.splice(0, Math.floor(trackList.length / 2));
              var romanceTracks = await this.getGenreTracks(
                trackList.length,
                "Romance"
              );
              trackList = trackList.concat(romanceTracks.tracks);

              // shuffle (twice just for fun)
              trackList = this.shufflePlaylist(trackList);
              trackList = this.shufflePlaylist(trackList);
            }

            break;
          case "Pedal to the metal":
            trackList = trackList.filter(track => track.tempo >= 120);
            break;
          case "Slow ride":
            trackList = trackList.filter(track => track.tempo < 120);
            break;
        }
      }

      if (riderAnswer) {
        switch (riderAnswer) {
          case "Kids":
            // going to add some tracks from the Kids category

            //var tracksToAdd = Math.floor(trackList.length * .25);
            trackList = trackList.splice(0, Math.floor(trackList.length / 2));
            var familyTracks = await this.getGenreTracks(
              trackList.length,
              "Kids",
              10
            );
            trackList = trackList.concat(familyTracks.tracks);

            // shuffle (twice just for fun)
            trackList = this.shufflePlaylist(trackList);
            trackList = this.shufflePlaylist(trackList);

            break;
        }
      }

      return {
        tracks: trackList,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

  /**
   * getRecentlyPlayedTracks
   * get user's recently played tracks
   */
  getRecentlyPlayedTracks: async function() {
    try {
      const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });

      var tracks = data.body.items.map(item => item.track);

      return {
        tracks: tracks,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

  /**
   * getMyTopTracks
   * get user's top tracks
   */
  getMyTopTracks: async function() {
    try {
      const data = await spotifyApi.getMyTopTracks({ limit: 50 });

      return {
        tracks: data.body.items,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

  /**
   * getMyLibraryTracks
   * get user's saved tracks
   */
  getMyLibraryTracks: async function() {
    try {
      const data = await spotifyApi.getMySavedTracks({ limit: 50 });

      var tracks = data.body.items.map(item => item.track);

      return {
        tracks: tracks,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

  /**
   * getFollowedArtistsTopTracks
   * get the top tracks from all artists this user follows
   * 1. get the artists the user follows
   * 2. get tracks for each of those artists
   */
  getFollowedArtistsTopTracks: async function() {
    try {
      var allArtistsFollowed,
        allArtistsFollowedTracks = [],
        loopPromise;

      allArtistsFollowed = await spotifyApi.getFollowedArtists({ limit: 50 });
      allArtistsFollowed = allArtistsFollowed.body.artists.items.map(
        item => item.id
      );

      const asyncLoopForArtistTracks = async _ => {
        const promises = allArtistsFollowed.map(async artistId => {
          var thisArtistFollowedTracks = await this.getArtistTopTracks(
            artistId
          );

          thisArtistFollowedTracks = thisArtistFollowedTracks.tracks;

          allArtistsFollowedTracks = allArtistsFollowedTracks.concat(
            thisArtistFollowedTracks
          );
          return;
        });

        loopPromise = await Promise.all(promises);
        return loopPromise;
      };

      const temp = await asyncLoopForArtistTracks();

      return {
        tracks: allArtistsFollowedTracks,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

  /**
   * getArtistTopTracks
   * get artist's top tracks
   */
  getArtistTopTracks: async function(artistId, country = "US") {
    try {
      var artistTopTracks = await spotifyApi.getArtistTopTracks(
        artistId,
        country
      );

      artistTopTracks = artistTopTracks.body.tracks;

      return {
        tracks: artistTopTracks,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        tracks: undefined,
        error: err
      };
    }
  },

/*
 * pause
 * simple function to pause in between uploading tracks (in the case of large playlist numbers)
 */
  pause: () => {
    return new Promise(resolve => setTimeout(() => {
      resolve();
    }, pauseDuration));

  },

  /**
   * createPlaylist
   * Create the playlist of tracks
   * @param array trackList
   * @return object
   */
  createSpotifyPlaylist: async function(trackList, ultimateTrack = null) {
    try {
      var playlistLengthText,
        vibeAnswer,
        playlistTitle,
        myPlaylists,
        previousPlaylists,
        playlistCreated,
        playlistUrl,
        me,
        username,
        // playlistId,
        tracksAdded,
        spotifyTracks,
        spotifyTracksSubset,
        numberOfTracksToLoad,
        imageUploaded,
        nextPlaylistNumber = 2;

      // Put together our title
      vibeAnswer = this.getQuestionAnswer(2);
      playlistLengthText = this.msToTime(tripDuration);
      playlistTitle = `Soundtrack Your Ride - ${playlistLengthText} - Road Trip`;

      /**
       *
       * Check for previous playlists with same name ...
       * if there are any, we need to increment the # at the end
       */
      myPlaylists = await spotifyApi.getUserPlaylists({ limit: 50 });
      myPlaylists = myPlaylists.body.items;
      myPlaylists = myPlaylists.map(playlist => playlist.name);

      // check for any previous playlists with our title format
      previousPlaylists = myPlaylists.filter(playlist =>
        playlist.includes(playlistTitle)
      );

      // if we find any, we look for the highest number and add one to that for the title of the next playlist
      if (previousPlaylists.length) {
        previousPlaylists.forEach(playlist => {
          // look for a number at the end
          var numAtEnd = playlist.match(/\d+$/);

          // if there is one,
          if (numAtEnd) {
            numAtEnd = parseInt(numAtEnd[0]);
            if (numAtEnd >= nextPlaylistNumber) {
              nextPlaylistNumber = numAtEnd + 1;
            }
          }
        });

        playlistTitle = playlistTitle + " #" + nextPlaylistNumber;
      }

      // if we have a really long playlist, we need to pause in between uploads or we fail
      // this should be improved by using the Retry-After header when we get an error code 429 back
      // https://developer.spotify.com/documentation/web-api/#rate-limiting
      if (trackList.length > 300) {
        doPause = true;
        pauseDuration = 2000;
      } else if (trackList.length > 100) {
        doPause = true;
        pauseDuration = 1000;
      }

      // get our user ID
      var me = await spotifyApi.getMe();
      username = me.body.id;

      // create the playlist on Spotify
      playlistCreated = await spotifyApi.createPlaylist(
        username,
        playlistTitle
      );

      // get the playlist ID and url
      playlistId = playlistCreated.body.id;
      playlistUrl = playlistCreated.body.external_urls.spotify;

      localStorage.setItem("playlistUrl", playlistUrl);
      localStorage.setItem("playlistLengthText", playlistLengthText);
      // localStorage.setItem('playlistId', playlistId);

      // remove any track with ID = undefined
      trackList = trackList.filter(track => track.id !== undefined && track.id !== 'undefined');

      // get a list of the tracks to upload in the proper format
      spotifyTracks = trackList.map(track => track.uri);

      // can only add 100 tracks at a time...
      while (spotifyTracks.length > 0) {

        numberOfTracksToLoad =
          spotifyTracks.length >= 50 ? 50 : spotifyTracks.length;

        spotifyTracksSubset = spotifyTracks.splice(0, numberOfTracksToLoad);

        tracksAdded = await this.addTracksToPlaylist(
          playlistId,
          spotifyTracksSubset
        );

        if(doPause) await this.pause();
        // use Retry-After here...
        // if error comes back, and code is 429, we've hit the rate limit.. wait and try again
        // if (tracksAdded.error) {
        //   console.log(tracksAdded.error);
        // }

      }

      // if there's an ultimate track, upload it and put it first
      if (ultimateTrack) {
        await this.addTracksToPlaylist(playlistId, [ultimateTrack.uri], true);
      }

      // some of the following code deals with uploading custom art depending on answers.. uploading
      // generic playlist art for now
      // var carAnswer = this.getQuestionAnswer(4);

      vibeAnswer = vibeAnswer ? vibeAnswer : "None";
      // carAnswer = carAnswer ? carAnswer : 'Sedan';

      // const vibeCars = playlistImageMatrix.filter(item => item.vibe === vibeAnswer)[0].cars;
      // const carImageData = vibeCars.filter(car => car.type === carAnswer)[0];
      // var carImageUrl = carImageData.image1x;
      // var carImageUrl2x = carImageData.image2x;

      // localStorage.setItem('playlistImage1x', carImageUrl);
      // localStorage.setItem('playlistImage2x', carImageUrl2x);
      localStorage.setItem(
        "playlistVibe",
        vibeAnswer === "None" ? "Custom Playlist" : vibeAnswer
      );

      // upload general playlist art
      const uploadedImage = await this.uploadCoverImage(
        playlistId,
        generalPlaylistImageBase64
      );
      console.log("uploadedImage", uploadedImage);

      return {
        playlistCreated: true,
        playlistUrl: playlistUrl,
        uploadedImage,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        playlistCreated: undefined,
        playlistUrl: undefined,
        error: err
      };
    }
  },

  /**
   * addTracksToPlaylist
   * @param string playlistId
   * @param array tracks e.g ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
   * @return object
   */
  addTracksToPlaylist: async function(playlistId, tracks, atBeginning = false) {
    try {
      // Add tracks to a playlist
      const options = atBeginning ? {position: 0} : {};
      const data = spotifyApi.addTracksToPlaylist(playlistId, tracks, options);
      return {
        results: data,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong adding tracks to the playlist!", err);
      return {
        results: undefined,
        error: err
      };
    }
  },

  /**
   * addPlaylistImage
   * @param string carBase64Text The image encoded in base64 format
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   * @return object
   */
  addPlaylistImage: async function(carBase64Text) {
    try {
      // need to remove the "header" data from the string
      carBase64Text = carBase64Text.substring(23, carBase64Text.length - 22);

      const data = await this.uploadCoverImage(playlistId, carBase64Text);

      return {
        results: data,
        error: undefined
      };
    } catch (err) {
      console.log("Something went wrong!", err);
      return {
        results: undefined,
        error: err
      };
    }
  },

  /**
   * uploadCoverImage
   * @param {*} playlistId
   * @param {*} base64
   */
  uploadCoverImage: async function(playlistId, base64Image) {
    try {
      const accessToken = spotifyApi.getAccessToken();
      const results = await fetch(
        `${apiEndpoint}/playlists/${playlistId}/images`,
        {
          method: "PUT",
          mode: "cors",
          // credentials: 'include',
          cache: "no-cache",
          headers: {
            "Content-Type": "image/jpeg",
            Authorization: `Bearer ${accessToken}`
          },
          body: base64Image // eg. '/9j/....'
        }
      );
      console.log("final results", results);
    } catch (e) {
      return { error: e };
    }
  }
};
