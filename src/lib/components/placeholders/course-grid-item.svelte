<script lang="ts">
</script>

<div
    class="grid grid-flow-row rounded-md p-1 gap-y-4 min-w-[240px] max-w-[240px] min-h-[300px] content-visibility-auto"
>
    <div class="w-[232px] h-[139px] placeholder animate-pulse" />

    <!-- Ratings -->
    <div class="h-5 w-36 placeholder animate-pulse bg-surface-300" />

    <!-- Title -->
    <div class="h-6 placeholder animate-pulse" />

    <!-- Course Stats -->
    <div class="grid justify-items-stretch item-center grid-flow-col gap-x-4">
        <div class="h-4 placeholder animate-pulse bg-surface-200" />
        <div class="h-4 placeholder animate-pulse bg-surface-200" />
        <div class="h-4 placeholder animate-pulse bg-surface-200" />
    </div>

    <hr class="mx-2" />

    <div class="grid grid-flow-col grid-cols-[1fr_1fr]">
        <!-- Instructor Row-->
        <div class="items-center px-2 grid grid-flow-col justify-items-start">
            <div class="flex items-center flex-flow-col gap-x-1">
                <!-- Instructor Photo -->
                <div class="w-6 h-6 rounded-full placeholder animate-pulse" />

                <!-- Instructor Name -->
                <div class="w-12 h-4 bg-surface-200 placeholder animate-pulse" />
            </div>
        </div>

        <div class="grid grid-rows-[1fr_1fr]">
            <div
                class=" grid grid-flow-col justify-items-end items-center h-min grid-cols-[1fr_auto] gap-2"
            >
                <!-- Original price -->
                <div class="w-8 h-4 bg-surface-200 placeholder animate-pulse" />

                <!-- Discounted price -->
                <div class="w-12 h-6 bg-surface-300 placeholder animate-pulse" />
            </div>
            <div class="grid grid-cols-[1fr_auto] justify-items-end items-center gap-x-1">
                <!-- Little Button -->
                <div class="w-5 h-5 rounded-full placeholder animate-pulse" />

                <!-- Big Button -->
                <div class="w-24 h-8 placeholder animate-pulse" />
            </div>
        </div>
    </div>
</div>
