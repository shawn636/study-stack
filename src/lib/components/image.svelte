<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script lang="ts">
    import { afterUpdate, onDestroy, onMount } from 'svelte';

    import Fa from 'svelte-fa';
    import { faImage } from '@fortawesome/free-solid-svg-icons';
    import { Skeleton } from '$lib/components/ui/skeleton';

    export let src: string;
    export let alt: string;

    export let width;
    export let height;

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
    $: imageErrorBaseClass = `${width} ${height} bg-muted-foreground/25 rounded-xl`;
    $: imageLoadingBaseClass = `${width} ${height}`;

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
        if (componentRef) {
            observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(componentRef);
        }
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
            <div class="grid h-full w-full place-items-center">
                <div class="flex flex-col items-center justify-center text-center">
                    <Fa class="text-6xl text-muted-foreground/60" icon={faImage} />
                    <p class="text-muted-foreground">Not Found</p>
                </div>
            </div>
        </div>
    {:else}
        <Skeleton class={imageLoadingBaseClass} />
    {/if}
</div>
