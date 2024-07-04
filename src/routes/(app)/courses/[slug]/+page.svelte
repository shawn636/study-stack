<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="grid w-full max-w-7xl justify-items-start gap-y-4">
        <div>
            <h1 class="text-lg font-bold">{data.course?.courseTitle}</h1>
            <p>{data.instructor?.userName}</p>
        </div>

        <p>{data.course?.courseDescription}</p>
    </div>
</div>
