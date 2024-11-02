<script lang="ts">
    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="grid w-full max-w-7xl justify-items-start gap-y-4">
        <div>
            <h1 class="text-lg font-bold">{data.course?.title}</h1>
            <p>{data.instructor?.name}</p>
        </div>

        <p>{data.course?.description}</p>
    </div>
</div>
