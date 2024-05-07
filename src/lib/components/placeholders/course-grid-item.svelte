<script lang="ts">
    import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div
    class="content-visibility-auto grid min-h-[300px] min-w-[240px] max-w-[240px] grid-flow-row gap-y-4 rounded-md p-1"
>
    <Skeleton class="h-[139px] w-[232px] animate-pulse" />

    <!-- Ratings -->
    <Skeleton class="h-5 w-36" />

    <!-- Title -->
    <Skeleton class="h-6" />

    <!-- Course Stats -->
    <div class="item-center grid grid-flow-col justify-items-stretch gap-x-4">
        <Skeleton class="h-4" />
        <Skeleton class="h-4" />
        <Skeleton class="h-4" />
    </div>

    <hr class="mx-2" />

    <div class="grid grid-flow-col grid-cols-[1fr_1fr]">
        <!-- Instructor Row-->
        <div class="grid grid-flow-col items-center justify-items-start px-2">
            <div class="flex-flow-col flex items-center gap-x-1">
                <!-- Instructor Photo -->
                <Skeleton class="h-6 w-6 rounded-full" />

                <!-- Instructor Name -->
                <Skeleton class="h-4 w-12" />
            </div>
        </div>

        <div class="grid grid-rows-[1fr_1fr]">
            <div
                class=" grid h-min grid-flow-col grid-cols-[1fr_auto] items-center justify-items-end gap-2"
            >
                <!-- Original price -->
                <Skeleton class="h-4 w-8" />

                <!-- Discounted price -->
                <Skeleton class=" h-6 w-12" />
            </div>
            <div class="grid grid-cols-[1fr_auto] items-center justify-items-end gap-x-1">
                <!-- Little Button -->
                <Skeleton class="h-5 w-5 rounded-full" />

                <!-- Big Button -->
                <Skeleton class="h-8 w-24" />
            </div>
        </div>
    </div>
</div>
