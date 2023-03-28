<script lang="ts">
	import { Briefcase, Star, Check } from 'svelte-heros-v2';
</script>

<div class="hidden lg:grid grid-rows-2 grid-cols-2 min-h-[290px]">
	<div
		class="z-10 grid-cols-[auto_1fr] px-3 gap-x-2 text-light-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 shadow-md font-medium bg-slate-100 w-36 h-14 row-start-3 col-start-1 rounded grid items-center justify-items-start"
	>
		<Briefcase
			class=" z-10 justify-self-center row-start-1 col-start-1 items-center justify-items-center"
			size="24"
		/>
		<div class="bg-blue-100 w-9 h-9 justify-self-center rounded-full row-start-1 col-start-1 z-0" />
		<div class="grid py-0 my-0 grid-flow-row col-start-2 row-start-1 text-sm text-left">
			<div class="text-light-blue-700 text-[0.8rem] h-4">3000+</div>
			<div class="text-[0.5em] text-gray-400">Free Courses</div>
		</div>
	</div>
	<img
		src="images/home-image-1.png"
		alt="woman sitting down and smiling near computer"
		class="row-start-1 row-end-4 first-letter ml-10 col-start-1 max-w-none hover:shadow-lg transition-all duration-300 hover:scale-105"
	/>
	<div
		class="z-10 px-2 gap-2 ml-28 grid-cols-[auto_1fr] hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 font-medium text-slate-800 bg-slate-100 w-40 h-14 row-start-2 col-start-1 col-end-3 justify-self-center rounded grid items-center justify-items-center shadow-md"
	>
		<img
			src="images/home-profile-image-4-optimized.png"
			alt="profile of man smiling"
			class="col-start-1 row-start-1"
		/>
		<div class="grid grid-flow-row justify-items-start">
			<span class="h-4 text-[0.8rem] text-light-blue-700">Jack Matheusen</span>
			<span class="h-3 text-slate-400 text-[0.5rem]">Biblical Studies</span>
			<span class="grid grid-cols-5 py-0.5 gap-x-0.5 justify-items-start">
				{#each { length: 5 } as _, i}
					<Star variation="solid" class="h-2.5 w-auto p-0 m-0 text-safron" />
				{/each}
			</span>
		</div>
	</div>
	<img
		src="images/home-image-2.png"
		alt="man smiling with headphones drinking lemonade"
		class="row-start-1 row-end-4 first-letter col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105"
	/>
	<div
		class="z-10 h-14 mt-14 grid-flow-row grid-rows-[35px_10px] grid-cols-[10px_1fr] grid items-center justify-items-start hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md bg-slate-100 row-start-4 col-start-1 col-end-3 justify-self-center rounded text-center"
	>
		<Check
			class="w-6 h-6 relative text-white -top-3 -left-3 p-1 m-0 self-start justify-self-start bg-light-blue-500 rounded-full row-start-1 row-end-3 shadow-md"
			variation="outline"
			strokeWidth="3"
		/>
		<div class="row-start-1 px-3 row-span-1 text-sm text-light-blue-700">Congrats!</div>
		<div class="row-start-2 px-3 row-span-1 text-xs text-slate-400">Your admission completed</div>
	</div>

	<img
		src="images/home-image-3.png"
		alt="woman sitting down by computer with cup of tea"
		class="row-start-3 row-end-5 first-letter col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105"
	/>
</div>
