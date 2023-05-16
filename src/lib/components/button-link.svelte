<script lang="ts">
	export let href = '/';

	export let styleOption: 'solid' | 'outline' = 'solid';
	export let width: string | 'auto' = 'auto';

	const buttonStyles = {
		solid:
			'font-medium bg-sky-900 shadow-md hover:shadow-lg transition-all ease-in-out duration-300 hover:bg-transpatent hover:bg-transparent hover:border-white hover:border-2',
		outline:
			'bg-transparent font-medium hover:bg-safron border-2 border-safron text-safron transition-all ease-in-out hover:text-slate-800 duration-300'
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
