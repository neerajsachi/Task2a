The API uses JWT for authentication. To access protected endpoints, clients must include the generated access token in the Authorization header prefixed with Bearer. The token is verified before granting access to protected resources.
/register: Registers a new user.
/login: Logs in an existing user and returns an access token.
/refresh: Refreshes the access token.
/test: A test endpoint to check if an authorized user is accessing the resource.
