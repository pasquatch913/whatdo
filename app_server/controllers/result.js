var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');
require('dotenv').config({path: 'S:\\programming\\whatdo\\my.env'});

module.exports.default2 = function(req, res, next) {
    var setParams = {
        location: req.body.city,
        radius_filter: req.body.radius,
        category_filter: req.body.category,
        sort: '2',
        limit: '20',
        offset: '20'
    };

    console.log(req.body);
    var resultPage = function(returnValues) {
      var result = JSON.parse(returnValues);
      // console.log(JSON.stringify(result));
      var numBiz = result['businesses'].length;
      var choice = Math.floor(Math.random() * numBiz);
      if (result['businesses'][choice]) {
        var selection = {
          name: result['businesses'][choice]['name'],
          category: result['businesses'][choice]['categories'].map(function (elem) {
            return elem.filter(function (innerElem, innerPos) {
              if (innerPos === 0) {
                return 1;
              }
            });
          }),
          yelpURL: result['businesses'][choice]['url'],
          thumbnail: result['businesses'][choice]['image_url'].replace(/https/g, 'http'),
          rating: result['businesses'][choice]['rating']
        }
        console.log(selection);
        res.render('resultLocation', {
          name: selection['name'],
          category: selection['category'],
          yelpURL: selection['yelpURL'],
          thumbnail: selection['thumbnail'],
          rating: selection['rating']
        });
      }
    }

    var request_yelp = function(set_parameters) {

        /* The type of request */
        var httpMethod = 'GET';

        /* The url we are using for the request */
        var url = 'http://api.yelp.com/v2/search';

        /* We can setup default parameters here */
        var default_parameters = {
            location: 'San+Francisco',
            sort: '2',
            category_filter: 'restaurants'
        };

        /* We set the require parameters here */
        var required_parameters = {
            oauth_consumer_key: process.env.oauth_consumer_key,
            oauth_token: process.env.oauth_token,
            oauth_nonce: n(),
            oauth_timestamp: n().toString().substr(0, 10),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0'
        };

        /* We combine all the parameters in order of importance */
        var parameters = _.assign(default_parameters, set_parameters, required_parameters);

        /* We set our secrets here */
        var consumerSecret = process.env.consumerSecret;
        var tokenSecret = process.env.tokenSecret;

        /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
        /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
        var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {
            encodeSignature: false
        });

        /* We add the signature to the list of paramters */
        parameters.oauth_signature = signature;

        /* Then we turn the paramters object, to a query string */
        var paramURL = qs.stringify(parameters);

        /* Add the query string to the url */
        var apiURL = url + '?' + paramURL;

        /* Then we use request to send make the API Request */
        request(apiURL, function(error, response, body) {
            resultPage(response['body']);
        });
    };

    request_yelp(setParams);
};
