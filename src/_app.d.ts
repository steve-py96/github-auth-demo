// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface Platform {}

	interface PrivateEnv {
		// https://github.com/settings/applications/new
		GITHUB_CLIENT_ID: string;
		GITHUB_CLIENT_SECRET: string;
		GITHUB_STATE: string;

		// sync jwt key
		JWT_SECRET: string;
	}

	// interface PublicEnv {}
}
