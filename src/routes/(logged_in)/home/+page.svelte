<script lang="ts">
    import type { PageServerData } from './$types';

    export let data: PageServerData;
</script>

<div class="grid grid-flow-rows gap-2">
    <h2 class="h2">Welcome back, {data.user.name.split(' ', 1)}!</h2>
    <div class="grid grid-flow-row gap-1">
        <h3>My Courses</h3>
        <div class="flex flex-flow-col gap-10">
            {#each [1, 2, 3] as num}
                <div class="placeholder w-20 h-20" />
            {/each}
        </div>
    </div>
</div>
