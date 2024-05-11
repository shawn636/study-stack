<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="grid w-full max-w-7xl justify-items-start gap-y-4">
        <div>
            <h1 class="text-lg font-bold">{data.courseWithInstructor?.courseTitle}</h1>
            <p>{data.courseWithInstructor?.userName}</p>
        </div>

        <p>{data.courseWithInstructor?.courseDescription}</p>
    </div>
</div>
