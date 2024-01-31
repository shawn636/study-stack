<script lang="ts">
    import type { CssClasses } from '@skeletonlabs/skeleton';
    import { onMount, onDestroy, afterUpdate } from 'svelte';

    export let src: string;
    export let alt: string;

    // export let widthUnits: number;
    // export let heightUnits: number;

    export let width: CssClasses;
    export let height: CssClasses;

    export let error = false;

    let imageWorker: Worker | undefined = undefined;

    let class_string = '';
    export { class_string as class };

    let imageUrl = '';
    let observer: IntersectionObserver;
    let componentRef: HTMLDivElement;
    let load_image_called = false;

    $: container_base_class = `${width} ${height}`;
    $: image_loaded_base_class = `object-cover object-center ${width} ${height} ${class_string}`;
    $: image_error_base_class = `placeholder ${width} ${height}`;
    $: image_loading_base_class = `placeholder animate-pulse asbolute ${width} ${height}`;

    const loadWorker = async () => {
        const ImageWorker = await import('$lib/workers/image.worker?worker');
        imageWorker = new ImageWorker.default();

        imageWorker.onmessage = (event) => {
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
                if (entry.isIntersecting && !load_image_called) {
                    load_image_called = true;
                    observer.disconnect();

                    if (imageWorker) {
                        imageWorker.postMessage({ src: src });
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
        URL.revokeObjectURL(imageUrl);
    });
</script>

<div bind:this={componentRef} class={container_base_class}>
    {#if imageUrl}
        <img src={imageUrl} role="presentation" {alt} class={image_loaded_base_class} />
    {:else if error}
        <div class={image_error_base_class}>
            <div
                class={'text-center text-gray-400 dark:text-gray-500 grid items-center justify-items-center h-full'}
            >
                <p class="text-gray-700 dark:text-white">Image failed to load</p>
            </div>
        </div>
    {:else}
        <div class={image_loading_base_class} />
    {/if}
</div>
