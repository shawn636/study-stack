<script lang="ts">
	import ButtonLink from '$lib/components/button-link.svelte';
	import HeroCollage from '$lib/components/hero-collage.svelte';
	const cta = 'Learn New Skills Online With Top ';
	const ctaUnderline = 'Educators';
	const subheading = `Build Skills With Courses, Certificates, 
											and Degrees Online From World-Class 
											Universities And Companies`;
	const tags = ['Over 12 million students', 'More than 60,000 courses', 'Learn anything online'];
</script>

<div class="bg-primary-500 dark:bg-primary-700 grid justify-items-center">
	<div
		class="grid justify-items-center gap-x-5 grid-cols-1 lg:grid-cols-[1fr_350px] px-5 pt-3 pb-7 md:px-24 max-w-7xl"
	>
		<div
			class="grid h-full grid-flow-row grid-cols-2 grid-rows-[repeat(4,auto)] gap-x-5 gap-y-5 text-white"
		>
			<h1 class="col-span-2 text-4xl font-semibold">
				<span>{cta}</span>
				<span class="underline text-secondary-500">{ctaUnderline}</span>
			</h1>

			<p class="col-span-2 row-start-2">{subheading}</p>

			<div
				class="grid grid-row-[auto_auto] my-4 col-span-2 justify-self-center gap-y-6 gap-x-3 xs:grid-rows-[auto] xs:grid-cols-[auto_auto] lg:justify-self-start"
			>
				<ButtonLink href="/courses" styleOption="outline" width="48">Find Courses</ButtonLink>
				<ButtonLink href="/auth/register" width="48">Join Now</ButtonLink>
			</div>

			<div
				class="grid gap-4 col-span-2 grid-flow-row-dense md:grid-flow-col-dense items-center justify-items-center text-sm text-center"
			>
				{#each tags as tag}
					<div
						class="grid gap-x-2 grid-cols-[auto_1fr] justify-items-center items-center whitespace-nowrap"
					>
						<div class="w-4 h-4 bg-white rounded" />
						<div>{tag}</div>
					</div>
				{/each}
			</div>
		</div>

		<HeroCollage />
	</div>
</div>
<svg
	width="1024"
	height="56"
	viewBox="0 0 1024 56"
	class="w-full fill-primary-500 dark:fill-primary-700 lg:h-20 z-negative"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<path
		d="M0 0H1024V29.8281C935.667 -3.12563 672.802 -4.62048 493 29.8281C301 66.6136 112.333 62.7818 0 29.8281V0Z"
	/>
</svg>
