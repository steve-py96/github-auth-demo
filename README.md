# prerequirements

- node 16/18
- pnpm

# how to use

1. visit [https://github.com/settings/applications/new](https://github.com/settings/applications/new) to create a new github oauth app
   1. set homepage URL to `http://localhost:5173`
   2. set callback URL to `http://localhost:5173/callback`
2. generate a client_secret in the new oauth app
3. rename `.env.example` to `.env`
4. copy client_id and client_secret from github into the env (generate state and jwt secret if desired, **it's optional for testing purpose** but recommended for production)
5. follow [how to run](#how-to-run)

# how to run

1. `pnpm install`
2. `pnpm run dev`

# how does it work

Note: The project uses [SvelteKit](https://kit.svelte.dev/), therefore markup is rendered on the server. Any further flow about files can be found there!

A user visits `http://localhost:5173` - which executes [src/routes/+page.server.ts](src/routes/+page.server.ts) and renders [src/routes/+page.svelte](src/routes/+page.svelte) with the request information afterwards (the server checks for the cookies in the request whether someone is logged in or not).

## User is logged in

The user sees a logout link (`http://localhost:5173/logout`, see [src/routes/logout/+server.ts](src/routes/logout/+server.ts)) which deletes the authorization cookie and redirects to `http://localhost:5173`.

## User is not logged in

The user sees a login link (`http://localhost:5173/login`, see [src/routes/login/+server.ts](src/routes/login/+server.ts)) which redirects to `https://github.com/login/oauth/authorize` with the github client_id and the generated state as query parameters. After logging in github redirects the user to `http://localhost:5173/callback` (see [src/routes/callback/+server.ts](src/routes/callback/+server.ts)) which validates the given code and the state provided by github, state should be the generated state and code is the login token (note: without lifetime limit!). If any errors appear the user is redirected to `http://localhost:5173` with an error.
Without errors the user is redirected to `http://localhost:5173` + a `Set-Cookie` header in the response where we store the name of the user within a generated [JWT](https://jwt.io).
On `http://localhost:5173` [src/routes/+page.server.ts](src/routes/+page.server.ts) now detects the cookie and can extract the name from the JWT!
