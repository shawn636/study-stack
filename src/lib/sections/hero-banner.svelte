<script lang="ts">
	import ButtonLink from '$lib/components/button-link.svelte';
	const cta = 'Learn New Skills Online With Top ';
	const ctaUnderline = 'Educators';
	const subheading = `Build Skills With Courses, Certificates, 
											and Degrees Online From World-Class 
											Universities And Companies`;
</script>

<div
	class="grid justify-items-center gap-x-5 grid-cols-1 lg:grid-cols-[1fr_350px] px-5 pt-3 pb-7 md:px-24 bg-light-blue-800"
>
	<div
		class="grid h-full grid-flow-row grid-cols-2 grid-rows-[repeat(4,auto)] gap-x-5 gap-y-5 text-white max-w-7xl"
	>
		<h1 class="col-span-2 text-4xl font-semibold">
			<span>{cta}</span>
			<span class="underline text-safron">{ctaUnderline}</span>
		</h1>

		<p class="col-span-2 row-start-2">{subheading}</p>

		<div
			class="grid grid-row-[auto_auto] col-span-2 justify-self-center gap-y-3 gap-x-3 xs:grid-rows-[auto] xs:grid-cols-[auto_auto] lg:justify-self-start"
		>
			<ButtonLink href="/" styleOption="outline" width="48">Find Courses</ButtonLink>
			<ButtonLink href="/" width="48">Join Now</ButtonLink>
		</div>
	</div>

	<div class="hidden lg:grid grid-rows-2 grid-cols-2 min-h-[290px]">
		<div
			class="z-10 hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 shadow-md font-medium text-slate-800 bg-slate-100 w-36 h-12 row-start-3 col-start-1 rounded grid items-center justify-items-center"
		>
			Thing 1
		</div>
		<img
			src="images/home-image-1.png"
			alt="woman sitting down and smiling near computer"
			class="row-start-1 row-end-4 first-letter pl-10 col-start-1 max-w-none hover:shadow-lg transition-all duration-300 hover:scale-105"
		/>
		<div
			class="z-10 hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 font-medium text-slate-800 bg-slate-100 w-36 h-12 row-start-2 col-start-1 col-end-3 justify-self-center rounded grid items-center justify-items-center shadow-md"
		>
			Thing 2
		</div>
		<img
			src="images/home-image-2.png"
			alt="man smiling with headphones drinking lemonade"
			class="row-start-1 row-end-4 first-letter col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105"
		/>
		<div
			class="z-10 hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md left-0 font-medium ml-20 text-slate-800 bg-slate-100 w-36 h-12 row-start-4 col-start-1 col-end-3 justify-self-center rounded grid items-center justify-items-center"
		>
			Thing 3
		</div>
		<img
			src="images/home-image-3.png"
			alt="woman sitting down by computer with cup of tea"
			class="row-start-3 row-end-5 first-letter col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105"
		/>
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
