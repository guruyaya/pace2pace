# Pace2Pace
Pace to pace is a simple, yet powerful way to conduct authentication, and link to services on a P2P basis.

## How it works?
The protocol is based on ideas used by OPENID V1.0. Bט that I mean - the basis is claiming a URL. However, instead of using an external service to authenticate - it will provide the users PUBLIC KEY. That means the process of authentication is not done on a separate server, but on the app doing the authentication. This means at no point, you need to trust an external service to handle the authentication.

## Why Pace2Pace?
### Passwords suck...
The worst thing about passwords, is that they are very vulnerable to attacks, they are either hard to remember, guessable, or worst of all - being reused. If you reuse a password, you gave the website you are using access to all websites you are using. Passwords managers make it a bit better, but that requires syncing passwords over the net.
### Facebook / Google logins suck...
This is a solution that violates your user privacy, and puts the security of your website, in the hands of other entities. This also requires an annoying setup, in Facebook / Google. There has to be be a better way...
### OPENID is not it...
Yeah, I like OPENID. But OPENID servers are not stable as Google / Facebook. If a website disappear tomorrow, a user may loose his access. It also puts the security of your website, in the hands of anyone that opens an OPENID authenticator.
### *Pace2Pace rocks!*
While this solution has a long way to go, until it'll become the De-Facto standard - It solves all of the issues, without creating any problems:
1. It uses one password to protect the key you are using, and this password doesn't compromise any other password, as the service you are using doesn't know it!
2. It uses Public key authentication, which is not crack able by guessing.
3. The authentication process, is done without involving 3rd parties. You can host the page wherever you want, you can move it around to wherever you want. If this project dies tomorrow, everything will still work the same. You just have to host the Pace2Pace page in another place.
4. Pace2Pace is design to be Pear-To-Pear. That opens the protocol to be used for services outside websites and apps. Allowing end users to authenticate each other!
## Protocol Definition
### Hosted file
While I find the details on this stage kinda fuzzy, I am expecting the first protocol to use a https hosted json file including several parameters:
* version: Protocol version (right now 0.2a)
* name: An identifier of the user
* avatar: Small (128x128) image, preferably base32/64 urls to prevent extra request (future implemation)
* urls: all urls that use this key.
* keys: public keys object. It's keys defined as follows: the name of the key, which is also the key of this object You must have one named \_ROOT. If you have key type future, it must be named \_FUTURE.
It's content defined as follows:
  - protocol: The public key scheme used. Version 0.2a is expected to support PGP only. Defaults to PGP
  - type: Can be either root, running, service, or future. Keys type abilities description will follow this list. Note that all keys type default to running, except \_ROOT that defaults to root, and \_FUTURE that defaults to future.
  - key: The key
  - service: Array of services using this key (or root, if you want to use it as service key, though not recommended). Version 0.2a will include a design for service named "web". Note that client must support the service it's authenticating against.
  - service-params: Json object. Used on service keys, and includes extra params. It has keys for each service. In "web" the service, it requires a url-regex and endpoint param, which is the url that starts the auth process - params  to complete authentication.
  - service-endpoint: Used on service keys, to indicate how to authenticate. On web services, it's used to set the login url.
  The json doc is signed with the ROOT key.
  - end-date: expected date for key to be replaced
* depricated: public keys used in the past, but cannot be used today. This includes all past key data, plus additional data. However the key objects are arranged as array of objects, so same key revisions of the same key, can be kept. This is used, if a data in the past was signed by any of the keys.
  - deprication-date: the GMT date / time of the deprication.
### Key types:
* root: While it's main function is to sign others keys, it can be used with any other function declared. There can only be one root key, in the keys list, and it has to be named \_ROOT.
IMPORTANT NOTE ABOUT ROOT KEYS: that the client 1-to-1 identfier is not the URL, but the root key. Meaning, a client can replace his url. The only reason a URL is used, is to invalidate old keys. The client is expected to keep his URLS in sync. The only reason he can specify several is to allow logins in case one of the services is down.

* running: This is what end user is expected to use in normal operation to log in and identify. can have multiple keys
* service: Used for running services, that other users are authenticating against. While running keys can be used this way, service keys are expected not to be password protected, thus better suited for this purpose only, and remote services should not authenticate against.
* future: While this is not a type expected to be implemented in version 1, this is a way to inform services of a root key expected to be replaced soon. There can only be one future key, in the keys list, and it has to be named \_FUTURE.
IMPORTANT NOTE ABOUSE FUTURE KEYS: All services that keep track of a user, are exptected to keep thier future keys stored. On login, if the root key could not be found in the list of users, the future keys must be scanned, and if found - should relace the current root key. This feature is a way to ensure the valitidy of future keys, when the become root keys.

### Mode of operation
(Note: all cache operations will be implemented after the release of version 1)
The authentication process goes as follows:
This section defines client, as the entity that wishes to authenticate, and service as the entity that it wishes to authenticate against.
1. The service presents should let the client know what service is used, the Pace2Pace urls, and the ID of the key to validate against. It should also include a random string, that it'll keep in the client session.
2. If the client cached the Pace2Pace url, it sends a head request, to see if e-tag or last modefied headers indicate a change. If not, the cached version is used, if it changed (or no header available), the tag is pulled again, and checked against the cached version. If they differ, we're going to client validation state. If not step 3 can be skipped.
3. Client validation includes:
* Signed json is well formed, and includes all required params for this version.
* Making sure the signature on the JSON file matches the ROOT key.
* Key can supply the suggested service.
* The url used, is one of the urls in the list of urls on the form. Note that the main key to identify a service stays the root key.
* It stands in all demands suggested by service configuration (In web case, that the URL of the web page must match the regex)
* It stands on all other client configuration requirements (like HTTPS)
4. At this point, the client will encrypt a json file, using the service public key, and sign it using it's own private key, with the suggested id, with the following params:
* url: Client Pace2Pace urls
* key: The key you want to authenticate with (This is designed to allow a user to use diffrent keys from diffrent devices)
* service: Service type (for now: web)
* token: the service provided token
5. The encrypted json file is sent to the service. Service decrypts, and make sure the JSON file is well formed, and can be used.
6. Service goes though a similar process to step 2. In case of a cached version found, step 7 can be skipped
7. Service validation includes:
* Signed json is well formed, and includes all required params for this version.
* Making sure the signature on the JSON file matches the ROOT key.
* Key type for key given is either root, future or running. Service keys cannot be used to validate against other service keys!
* Key stands in the requirements set by service configuration.
* The url used, is one of the urls in the list of urls on the form. Note that the main key to identify a service stays the root key.
8. At this point, the client can validate the sent json file signature matches the suggested key id signature. At this point the client is verified. However if additional information is needed by the service, it can send additional requests, and the client should be able to provide it, in future implemations.
NOTE: This process cannot be secured from Man In The Middle attacks, without HTTPS connection on the server. I could not think of a way of attacking the keys, if https is not used, but it seems like the right thing to do.

## TODO
1. Create a Python / php implementation of the server side authentication process
2. Create a web2py / wordpress login sceme,
3. Create basic Firefox addon
If all goes well, we'll see how it goes from here
