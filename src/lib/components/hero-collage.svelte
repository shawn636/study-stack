<script lang="ts">
	import { faBriefcase, faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
</script>

<div class="hidden lg:grid grid-rows-2 grid-cols-2">
	<div
		class="z-10 self-center grid-cols-[auto_1fr] px-4 py-3 gap-x-2 text-light-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 shadow-md font-medium bg-slate-100 row-start-1 row-end-3 col-start-1 col-end-3 rounded grid items-center justify-items-start w-48 h-16"
	>
		<Fa
			icon={faBriefcase}
			class="z-10 justify-self-center row-start-1 col-start-1 items-center justify-items-center"
			size="20"
		/>

		<div class="bg-blue-100 w-9 h-9 justify-self-center rounded-full row-start-1 col-start-1 z-0" />
		<div class="grid py-0 my-0 grid-flow-row col-start-2 row-start-1 text-sm text-left">
			<div class="text-light-blue-800 text-sm font-medium">3000+</div>
			<div class="text-sm font-normal text-slate-400 whitespace-nowrap">Free Courses</div>
		</div>
	</div>
	<img
		src="images/home-image-1.png"
		alt="woman sitting down and smiling near computer"
		class="row-start-1 row-end-3 first-letter col-start-1 max-w-none hover:shadow-lg transition-all duration-300 hover:scale-105 ml-3"
	/>
	<div
		class="z-10 px-4 h-16 w-48 mt-14 gap-2 ml-32 grid-cols-[auto_1fr] hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 font-medium text-slate-800 bg-slate-100 row-start-1 col-start-1 col-end-3 justify-self-center rounded grid items-center justify-items-center shadow-md"
	>
		<img
			src="images/home-profile-image-4-optimized.png"
			alt="profile of man smiling"
			class="col-start-1 row-start-1"
		/>
		<div class="grid grid-flow-row justify-items-start items-center">
			<span class="text-sm text-light-blue-800 font-medium">Jack Matheusen</span>
			<span class="text-slate-400 text-sm font-normal">Biblical Studies</span>
			<span class="grid grid-cols-5 gap-x-0.5 justify-items-start">
				{#each { length: 5 } as _, i}
					<Fa icon={faStar} size="10" class="text-secondary-500" />
				{/each}
			</span>
		</div>
	</div>
	<img
		src="images/home-image-2.png"
		alt="man smiling with headphones drinking lemonade"
		class="row-start-1 row-end-2 first-letter col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105"
	/>
	<div
		class="z-10 h-16 w-52 mb-6 self-end grid-flow-row grid-rows-[35px_10px] grid-cols-[10px_1fr] grid items-center justify-items-start hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md bg-slate-100 row-start-2 col-start-1 col-end-3 justify-self-center rounded text-center"
	>
		<Fa
			icon={faCheck}
			size="24"
			class="relative text-white -top-3 -left-3 p-1 m-0 self-start justify-self-start bg-green-500 rounded-full row-start-1 row-end-3 shadow-md"
		/>
		<div class="row-start-1 px-3 row-span-1 text-sm font-medium text-light-blue-800">Congrats!</div>
		<div class="row-start-2 px-3 row-span-1 text-sm text-slate-400 whitespace-nowrap">
			Your admission completed
		</div>
	</div>

	<img
		src="images/home-image-3.png"
		alt="woman sitting down by computer with cup of tea"
		class="row-start-1 row-end-3 col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105 mt-36 mb-12"
	/>
</div>
