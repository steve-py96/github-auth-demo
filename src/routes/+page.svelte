<script lang="ts">
	import { page } from '$app/stores';
	import MainPageError from '$lib/MainPageError.svelte';

	export let data: { name: string };

	let error = $page.url.searchParams.get('error');
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Sveltekit GitHub Login" />
</svelte:head>

{#if error}
	<MainPageError {error} />
{:else if data.name}
	<p>
		peace {data.name}
	</p>
	<a href="/logout">logout</a>
{:else}
	<a href="/login">login</a>
{/if}
