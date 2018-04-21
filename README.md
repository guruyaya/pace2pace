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
* reclaim: An array of past Pace2Pace urls to reclaim.  (future implemation) Note that past URLS must share the same root, or that future key. This is used if a user lost access to a page, but still has access to the used key.
* keys: public keys object. Defined as follows:
  - name: the name of the key, which is also the key of this object You must have one named \_ROOT. If you have key type future, it must be named \_FUTURE
  - protocol: The public key scheme used. Version 0.2a is expected to support GPG only
  - type: Can be either root, running, service, or future. Keys type abilities description will follow this list
  - key: The key
  - service: Array of services using this key (or root, if you want to use it as service key, though not recommended). Version 0.2a will include a design for service named "web". Note that client must support the service it's authenticating against.
  - service-params: Json object. Used on service keys, and includes extra params. It has keys for each service. In "web" the service, it requires a url-regex and endpoint param, which is the url that starts the auth process - params  to complete authentication.
  - service-endpoint: Used on service keys, to indicate how to authenticate. On web services, it's used to set the login url.
  The json doc is signed with the ROOT key.

### Key types:
* root: While it's main function is to sign others keys, it can be used with any other function declared.
* running: This is what end user is expected to use in normal operation to log in and identify. can have multiple keys
* service: Used for running services, that other users are authenticating against. While running keys can be used this way, service keys are expected not to be password protected, thus better suited for this purpose only, and remote services should not authenticate against.
* future: While this is not a type expected to be implemented in version 1, this is a way to inform services of a root key expected to be replaced soon.

### Mode of operation
The authentication process goes as follows:
This section defines client, as the entity that wishes to authenticate, and service as the entity that it wishes to authenticate against.
1. The service presents should let the client know what service is used, the Pace2Pace url, and the ID of the key to validate against.
2. If the client cached the Pace2Pace url, it sends a head request, to see if e-tag or last modefied headers indicate a change. If not, the cached version is used, if it changed (or no header available), the tag is pulled again, and checked against the cached version. If they differ, we're going to client validation state. If not step 3 can be skipped.
3. Client validation includes:
* Signed json is well formed, and includes all required params for this version.
* Making sure the signature on the JSON file matches the ROOT key.
* Key can supply the suggested service.
* It stands in all demands suggested by service configuration (In web case, that the URL of the web page must match the regex)
* It stands on all other client configuration requirements (like HTTPS)
4. At this point, the client will encrypt a json file, using the service public key, with the following params:
* url: Client Pace2Pace url
* key: The key you want to authnticate with (This is designed to allow a user to use diffrent keys from diffrent devices)
* service: Service type (for now: web)
* token: A random string, 128-256 chars long.
5. The encrypted json file is sent to the service. Service decryptes, and make sure the JSON file is well formed, and can be used. It also validates that the service asked is provided by this endpoint.
6. Service goes though a similar process to step 2. In case of a cached version found, step 7 can be skipped
7. Service validation includes:
* Signed json is well formed, and includes all required params for this version.
* Making sure the signature on the JSON file matches the ROOT key.
* Key type for key given is either root, future or running. Service keys cannot be used to validate against other service keys!
* Key stands in the requirements set by service configuration.
8. Assuming all went well, a json file, encrypted with the client public key, is created with the following params:
* url: service Pace2Pace url (this is set to prevent man in the middle attacks)
* your-token: The token sent by the user. This is a proof that the server managed to decrypt the user message
* token: A random string, 128-256 chars long.
* end-point: If the 2nd request is destined to another end-point.
* extra: Extra requested data. Fields will be named, and basic validators can be set. It may include mandetory fields for the client to give before signing in (extra field is not mandatory, future implemation)
9. Service sends back the encrypted json file
10. Client decrypts the message, makes sure it's well formed, and he got all the data it needs.
11. Client makes sure hist sent token, and the service "your-token" fields match.
12. Client encrypts, using the service public key, another JSON file, that includes the following:
* url: Client Pace2Pace url again. (again, prevent man in the middle)
* your-token: Proff that the json file was read
* extra: The extra data requested, and the client is willing to provide.
13. Encrypted json sent to service (new endpoint if requested)
14. Service sends back additional instructions. Json Encrypted, with the Pace2Pace URL. In the web service implemation a rediect url is possible.

## TODO
1. Create a Python implementation of the server side authentication process
2. Create a web2py login sceme,
3. Create basic Chrome addon
If all goes well, we'll see how it goes from here
