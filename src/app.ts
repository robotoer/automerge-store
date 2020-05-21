import express from 'express';
export const app = express();

import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";

require("express-jwt-authz");

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://conference-queue.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'YOUR_API_IDENTIFIER',
  issuer: `https://conference-queue.auth0.com/`,
  algorithms: ['RS256']
});
// This route doesn't need authentication

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

RegisterRoutes(app);


// // This route doesn't need authentication
// app.get('/api/public', function(req, res) {
//   res.json({
//     message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//   });
// });

// // This route needs authentication
// app.get('/api/private', checkJwt, function(req, res) {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated to see this.'
//   });
// });

// const checkScopes = jwtAuthz([ 'read:messages' ]);

// app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//   });
// });
