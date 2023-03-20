<script lang="ts">
	export let href = '/';

	export let styleOption: 'solid' | 'outline' = 'solid';
	export let width: string | 'auto' = 'auto';

	const buttonStyles = {
		solid: 'bg-sky-900 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300',
		outline: 'bg-transparent border-2 border-safron text-safron'
	};
</script>

<a
	{href}
	class="{buttonStyles[
		styleOption
	]} px-10 py-2 w-{width} text-center rounded whitespace-nowrap self-center"
>
	<slot />
</a>
