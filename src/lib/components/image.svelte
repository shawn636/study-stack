<script lang="ts">
    import type { CssClasses } from '@skeletonlabs/skeleton';

    import { afterUpdate, onDestroy, onMount } from 'svelte';

    export let src: string;
    export let alt: string;

    // export let widthUnits: number;
    // export let heightUnits: number;

    export let width: CssClasses;
    export let height: CssClasses;

    export let error = false;

    let worker: Worker | undefined = undefined;

    let classString = '';
    export { classString as class };

    let imageUrl = '';
    let observer: IntersectionObserver;
    let componentRef: HTMLDivElement;
    let loadImageCalled = false;

    $: containerBaseClass = `${width} ${height}`;
    $: imageLoadedBaseClass = `object-cover object-center ${width} ${height} ${classString}`;
    $: imageErrorBaseClass = `placeholder ${width} ${height}`;
    $: imageLoadingBaseClass = `placeholder animate-pulse asbolute ${width} ${height}`;

    const loadWorker = async () => {
        const imageWorker = await import('$lib/workers/image.worker?worker');
        worker = new imageWorker.default();

        worker.onmessage = (event) => {
            if (event.data.error) {
                error = true;
            }

            if (event.data.img) {
                imageUrl = event.data.img;
            }
        };
    };

    onMount(async () => {
        await loadWorker();

        // eslint-disable-next-line no-undef
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        // eslint-disable-next-line no-undef
        const handleIntersect: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !loadImageCalled) {
                    loadImageCalled = true;
                    observer.disconnect();

                    if (worker) {
                        worker.postMessage({ src: src });
                    }
                }
            });
        };
        observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(componentRef);
    });

    afterUpdate(() => {
        if (observer) {
            observer.observe(componentRef);
        }
    });

    onDestroy(() => {
        if (observer) {
            observer.disconnect();
        }
    });
</script>

<div bind:this={componentRef} class={containerBaseClass}>
    {#if imageUrl}
        <img {alt} class={imageLoadedBaseClass} role="presentation" src={imageUrl} />
    {:else if error}
        <div class={imageErrorBaseClass}>
            <div
                class={'grid h-full items-center justify-items-center text-center text-gray-400 dark:text-gray-500'}
            >
                <p class="text-gray-700 dark:text-white">Image failed to load</p>
            </div>
        </div>
    {:else}
        <div class={imageLoadingBaseClass} />
    {/if}
</div>
