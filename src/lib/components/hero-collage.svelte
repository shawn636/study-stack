<script lang="ts">
    import { faBriefcase, faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
</script>

<div class="hidden lg:grid grid-rows-2 grid-cols-2">
    <div
        class="z-[1] self-center grid-cols-[auto_1fr] px-4 py-3 gap-x-2 text-light-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 shadow-md font-medium bg-slate-100 row-start-1 row-end-3 col-start-1 col-end-3 rounded grid items-center justify-items-start w-48 h-16"
    >
        <Fa
            icon={faBriefcase}
            class="z-[1] justify-self-center row-start-1 col-start-1 items-center justify-items-center"
            size="lg"
        />

        <div
            class="z-0 bg-blue-100 rounded-full w-9 h-9 justify-self-center row-start-1 col-start-1"
        />
        <div class="py-0 my-0 text-sm text-left grid grid-flow-row col-start-2 row-start-1">
            <div class="text-sm font-medium text-light-blue-800">3000+</div>
            <div class="text-sm font-normal text-slate-400 whitespace-nowrap">Free Courses</div>
        </div>
    </div>
    <img
        src="images/home-image-1-optimized.webp"
        alt="woman sitting down and smiling near computer"
        class="ml-3 row-start-1 row-end-3 first-letter col-start-1 max-w-none hover:shadow-lg transition-all duration-300 hover:scale-105"
    />
    <div
        class=" z-[1] px-4 h-16 w-48 mt-14 gap-2 ml-32 grid-cols-[auto_1fr] hover:shadow-lg transition-all duration-300 hover:scale-105 left-0 font-medium text-slate-800 bg-slate-100 row-start-1 col-start-1 col-end-3 justify-self-center rounded grid items-center justify-items-center shadow-md"
    >
        <img
            src="images/home-profile-image-4-optimized.webp"
            alt="profile of man smiling"
            class="col-start-1 row-start-1"
        />
        <div class="items-center grid grid-flow-row justify-items-start">
            <span class="text-sm font-medium text-light-blue-800">Jack Matheusen</span>
            <span class="text-sm font-normal text-slate-400">Biblical Studies</span>
            <span class="grid grid-cols-5 gap-x-0.5 justify-items-start">
                <Fa icon={faStar} size="xs" class="text-secondary-500" />
                <Fa icon={faStar} size="xs" class="text-secondary-500" />
                <Fa icon={faStar} size="xs" class="text-secondary-500" />
                <Fa icon={faStar} size="xs" class="text-secondary-500" />
                <Fa icon={faStar} size="xs" class="text-secondary-500" />
            </span>
        </div>
    </div>
    <img
        src="images/home-image-2-optimized.webp"
        alt="man smiling with headphones drinking lemonade"
        class="row-start-1 row-end-2 first-letter col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105"
    />
    <div
        class="z-[1] h-16 w-52 mb-6 self-end grid-flow-row grid-rows-[35px_10px] grid-cols-[10px_1fr] grid items-center justify-items-start hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md bg-slate-100 row-start-2 col-start-1 col-end-3 justify-self-center rounded text-center"
    >
        <Fa
            icon={faCheck}
            size="1.5x"
            class="relative self-start p-1 m-0 text-white bg-green-500 rounded-full shadow-md -top-3 -left-3 justify-self-start row-start-1 row-end-3"
        />
        <div class="px-3 text-sm font-medium row-start-1 row-span-1 text-light-blue-800">
            Congrats!
        </div>
        <div class="px-3 text-sm row-start-2 row-span-1 text-slate-400 whitespace-nowrap">
            Your admission completed
        </div>
    </div>

    <img
        src="images/home-image-3-optimized.webp"
        alt="woman sitting down by computer with cup of tea"
        class="mb-12 row-start-1 row-end-3 col-start-2 col-end-3 max-w-none justify-self-end hover:shadow-lg transition-all duration-300 hover:scale-105 mt-36"
    />
</div>
