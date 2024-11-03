<script lang="ts">
    import { faBriefcase, faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
</script>

<div class="hidden grid-cols-2 grid-rows-2 lg:grid">
    <div
        class="left-0 z-[1] col-start-1 col-end-3 row-start-1 row-end-3 grid h-16 w-48 grid-cols-[auto_1fr] items-center justify-items-start gap-x-2 self-center rounded bg-slate-100 px-4 py-3 font-medium text-blue-500 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
        <Fa
            class="z-[1] col-start-1 row-start-1 items-center justify-items-center justify-self-center"
            icon={faBriefcase}
            size="lg"
        />

        <div
            class="z-0 col-start-1 row-start-1 h-9 w-9 justify-self-center rounded-full bg-blue-100"
        ></div>
        <div class="col-start-2 row-start-1 my-0 grid grid-flow-row py-0 text-left text-sm">
            <div class="text-sm font-medium text-blue-500">3000+</div>
            <div class="whitespace-nowrap text-sm font-normal text-slate-400">Free Courses</div>
        </div>
    </div>
    <img
        alt="woman sitting down and smiling near computer"
        class="first-letter col-start-1 row-start-1 row-end-3 ml-3 max-w-none transition-all duration-300 hover:scale-105 hover:shadow-lg"
        src="images/home-image-1-optimized.webp"
    />
    <div
        class=" left-0 z-[1] col-start-1 col-end-3 row-start-1 ml-32 mt-14 grid h-16 w-48 grid-cols-[auto_1fr] items-center justify-items-center gap-2 justify-self-center rounded bg-slate-100 px-4 font-medium text-slate-800 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
        <img
            alt="profile of man smiling"
            class="col-start-1 row-start-1"
            src="images/home-profile-image-4-optimized.webp"
        />
        <div class="grid grid-flow-row items-center justify-items-start">
            <span class="text-sm font-medium text-blue-500">Jack Matheusen</span>
            <span class="text-sm font-normal text-slate-400">Biblical Studies</span>
            <span class="grid grid-cols-5 justify-items-start gap-x-0.5">
                <Fa class="text-yellow-500" icon={faStar} size="xs" />
                <Fa class="text-yellow-500" icon={faStar} size="xs" />
                <Fa class="text-yellow-500" icon={faStar} size="xs" />
                <Fa class="text-yellow-500" icon={faStar} size="xs" />
                <Fa class="text-yellow-500" icon={faStar} size="xs" />
            </span>
        </div>
    </div>
    <img
        alt="man smiling with headphones drinking lemonade"
        class="first-letter col-start-2 col-end-3 row-start-1 row-end-2 max-w-none justify-self-end transition-all duration-300 hover:scale-105 hover:shadow-lg"
        src="images/home-image-2-optimized.webp"
    />
    <div
        class="z-[1] col-start-1 col-end-3 row-start-2 mb-6 grid h-16 w-52 grid-flow-row grid-cols-[10px_1fr] grid-rows-[35px_10px] items-center justify-items-start self-end justify-self-center rounded bg-slate-100 text-center shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
        <Fa
            class="relative -left-3 -top-3 row-start-1 row-end-3 m-0 self-start justify-self-start rounded-full bg-green-500 p-1 text-white shadow-md"
            icon={faCheck}
            size="1.5x"
        />
        <div class="row-span-1 row-start-1 px-3 text-sm font-medium text-blue-500">Congrats!</div>
        <div class="row-span-1 row-start-2 whitespace-nowrap px-3 text-sm text-slate-400">
            Your admission completed
        </div>
    </div>

    <img
        alt="woman sitting down by computer with cup of tea"
        class="col-start-2 col-end-3 row-start-1 row-end-3 mb-12 mt-36 max-w-none justify-self-end transition-all duration-300 hover:scale-105 hover:shadow-lg"
        src="images/home-image-3-optimized.webp"
    />
</div>
