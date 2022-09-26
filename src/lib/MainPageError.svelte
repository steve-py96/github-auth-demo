<script lang="ts">
	export let error: string;
</script>

{#if error === 'github_access'}
	Failed to access GitHub
{:else if error === 'github_user'}
	Failed to fetch GitHub user
{:else if error === 'token'}
	Failed to generate user token
{/if}
