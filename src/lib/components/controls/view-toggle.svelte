<script lang="ts">
    import type { AnimationItem } from 'lottie-web';

    import animationData from '$lib/lottie/grid-list-toggle.json';
    import lottie from 'lottie-web';
    import { onMount } from 'svelte';

    type ViewOption = 'grid' | 'list';
    interface Animation {
        end: number;
        playDirection: -1 | 1;
        playSpeed: number;
        start: number;
    }

    export let value: 'grid' | 'list' = 'grid';

    // let animationContainer: HTMLElement;
    let animationContainer: HTMLElement;
    let animation: AnimationItem | null = null;

    const animations: Record<ViewOption, Animation> = {
        grid: { end: 57, playDirection: 1, playSpeed: 1, start: 16 },
        list: { end: 16, playDirection: -1, playSpeed: 1.5, start: 57 }
    };

    onMount(() => {
        animation = lottie.loadAnimation({
            animationData: animationData,
            autoplay: false,
            container: animationContainer,
            loop: false
        });

        animation.goToAndStop(animations[value].start, true);

        return () => {
            animation?.destroy();
        };
    });

    const toggle = async () => {
        animation?.setDirection(animations[value].playDirection);
        animation?.setSpeed(animations[value].playSpeed);
        animation?.playSegments([animations[value].start, animations[value].end], true);
        value = value === 'grid' ? 'list' : 'grid';
    };
</script>

<button
    aria-label={value === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
    class="variant-filled-primary btn m-0 h-10 w-10 p-0 text-white"
    on:click={toggle}
    style="position: relative; overflow: hidden; width: 40px; height: 40px;"
>
    <div>
        <div
            bind:this={animationContainer}
            style={`position: absolute; top: 0; left: 0; width: 100%; height: 100%; visibility: ${animation ? 'visible' : 'hidden'};`}
        />

        <img
            alt={value === 'grid' ? 'grid icon' : 'list icon'}
            src={value === 'grid'
                ? '/images/grid-placeholder.webp'
                : '/images/list-placeholder.webp'}
            width={value === 'grid' ? '25px' : '23.5px'}
        />
    </div>
</button>
