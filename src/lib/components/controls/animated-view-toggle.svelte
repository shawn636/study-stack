<script lang="ts">
    import type { AnimationItem } from 'lottie-web';

    import { Button } from '$lib/components/ui/button';
    import animationData from '$lib/lottie/grid-list-toggle.json';
    import lottie from 'lottie-web';
    import { onMount } from 'svelte';

    type ViewOption = 'grid' | 'list';
    /**
     * Represents an animation configuration.
     */
    interface Animation {
        /**
         * The frame number where the animation ends.
         */
        end: number;

        /**
         * The direction in which the animation should play.
         * -1 represents reverse direction, 1 represents forward direction.
         */
        playDirection: -1 | 1;

        /**
         * The speed at which the animation should play.
         * A value of 1 represents normal speed.
         */
        playSpeed: number;

        /**
         * The frame number where the animation starts.
         */
        start: number;
    }

    export let value: 'grid' | 'list' = 'grid';

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

<Button
    aria-label={value === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
    class="m-0 h-10 w-10 bg-equipped-blue p-0 text-white transition-all hover:scale-105 hover:bg-equipped-blue"
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
</Button>
