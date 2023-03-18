<script lang="ts">
	import ButtonLink from '$lib/components/button-link.svelte';
	const cta = 'Learn New Skills Online With Top ';
	const ctaUnderline = 'Educators';
	const subheading = `Build Skills With Courses, Certificates, 
											and Degrees Online From World-Class 
											Universities And Companies`;
</script>

<div class="grid justify-items-center px-5 pt-5 md:px-24 bg-light-blue-800">
	<div class="grid h-full grid-flow-row grid-cols-6 grid-rows-4 gap-2 text-white max-w-7xl">
		<div class="col-span-6 row-start-1 text-4xl font-semibold lg:col-span-3">
			<span>{cta}</span>
			<span class="underline text-safron">{ctaUnderline}</span>
		</div>

		<div class="col-span-6 row-start-2 lg:col-span-3">{subheading}</div>

		<div
			class="grid grid-flow-row col-span-6 xs:grid-flow-col row-start-3 gap-x-2 justify-self-stretch justify-items-center items-center gap-2 lg:col-span-3"
		>
			<ButtonLink href="/" styleOption="outline" width="48">Find Courses</ButtonLink>
			<ButtonLink href="/" width="48">Join Now</ButtonLink>
		</div>
	</div>
</div>
<svg
	width="1024"
	height="56"
	viewBox="0 0 1024 56"
	class="w-full fill-light-blue-800 lg:h-20 z-negative"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<path
		d="M0 0H1024V29.8281C935.667 -3.12563 672.802 -4.62048 493 29.8281C301 66.6136 112.333 62.7818 0 29.8281V0Z"
	/>
</svg>
