# Pace2Pace
Pace to pace is a simple, yet powerful way to conduct authentication, and link to services on a P2P basis.

## How it works?
The protocol is based on ideas used by OPENID V1.0. Bט that I mean - the basis is claiming a URL. However, instead of using an external service to authenticate - it will provide the users PUBLIC KEY. That means the process of authentication is not done on a separate server, but on the app doing the authentication. This means at no point, you need to trust an external service to handle the authentication.

## Protocol Definition
While I find the details on this stage kinda fuzzy, I am expecting the first protocol to use to following meta tags:

"pace2pace-version" (will start with "0.1a")

"pace2pace-key-protocol" (At this point pace2pace will support only "GPG" keys)

"pace2pace-key" (the user public key)

"pace2pace-sev-key-protocol" (a user can provide a key to be used by automated systems. This will allow creating a more secure version for ordinary use, and a less secure for running services)

"pace2pace-sev-key" (the service public key)

"pace2pace-timestamp" (last change timestamp)

"pace2pace-service-[service name]" (I expect future development of the protocol, will lead to development of serivce providers, that will ride on it's possibilities to provide services. This tag will be kept open to allow services)

"pace2pace-delegate" (allows a user to delegate the page to another service)

"pace2pace-domain" will list all domains, allowed to use this authentication method. This is used on services that have a domain name, and wish to prevent other services from exploiting them using man in the middle attack.

"pace2pace-name" (will provide a name for this page, to allow a user to be identified)

"pace2pace-avatar" (base32 avatar image url)

## Mode of operation
The authentaction process goes as follows:
1. The user that wishes to authenticate, contacts the service, with a request encoded with the service public key. It will provide it's pace2pace URL.
2. In a normal course of operation, the service try to read the remote page to get the key. However the service can cache keys, or decide that the key looks suspicious for some reason.
3. The service will provide the user with a random string it generated, plus the string provided by the user - and encode it using the users public key.
4. The user will decode the remote service string, and return it, encoded with the service public key.
5. The service will see that the provided string, after decoding, matches the random string it sent, thous proving the user had access to the private key, thous claiming ownership of the URL

## TODO
1. Create a Python implementation of the server side authentication process
2. Create a web2py login sceme, and a basic Chrome addon
3. Create a JAVA implementation of the server side authentication process
4. Create a separate project as a web service that will allow Simple Pace2Pace auth pages
5. Defining issues of page validation by other user, and revoking keys when compremised.
