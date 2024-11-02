<script lang="ts">
    import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

    import Avatar from './avatar.svelte';
    import Fa from 'svelte-fa';

    const socials = [
        {
            icon: faGithub,
            name: 'GitHub',
            url: 'https://github.com/shawnlong636'
        },
        {
            icon: faLinkedin,
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/shawnlong636'
        }
    ];

    let isFlipped = $state(false);

    function toggleFlip() {
        isFlipped = !isFlipped;
    }
</script>

<!-- <div
    class="hover:animate-glow h-full w-full rounded-xl border-white bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-4 text-white shadow-md transition-transform duration-300 ease-out hover:scale-105 hover:border-2"
>
    <div class="flex h-full w-full flex-col items-center justify-center">
        <Avatar class="mx-auto aspect-square w-3/4" />
        <h2 class="mt-2 text-center text-2xl font-bold">Shawn Long</h2>
        <p class="text-center">Co-Founder & Engineer</p>
        <div class="mt-4 flex space-x-4">
            {#each socials as { icon, url }}
                <a class="hover:text-white/80" href={url} rel="noopener" target="_blank">
                    <Fa {icon} size="2x" />
                </a>
            {/each}
        </div>
    </div>
</div> -->

<div
    class="card-container perspective-1000 h-full w-full"
    onclick={toggleFlip}
    role="presentation"
>
    <div
        class="card transform-style-preserve-3d transition-transform-800 relative h-full w-full"
        class:rotate-y-180={isFlipped}
    >
        <!-- Front Face -->
        <div class="card__face backface-hidden absolute inset-0">
            <div
                class="h-full w-full rounded-xl border-white bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-4 text-white shadow-md transition-transform duration-300 ease-out hover:scale-105 hover:animate-glow hover:border-2"
            >
                <div class="flex h-full w-full flex-col items-center justify-center">
                    <Avatar class="mx-auto aspect-square w-3/4" />
                    <h2 class="mt-2 text-center text-2xl font-bold">Shawn Long</h2>
                    <p class="text-center">Co-Founder & Engineer</p>
                    <div class="mt-4 flex space-x-4">
                        {#each socials as { icon, url }}
                            <a
                                class="hover:text-white/80"
                                href={url}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Fa {icon} size="2x" />
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Back Face -->
        <div class="card__face backface-hidden rotate-y-180 absolute inset-0">
            <div
                class="h-full w-full rounded-xl border-white bg-gradient-to-bl from-green-500 via-yellow-500 to-red-500 p-4 text-white shadow-md transition-transform duration-300 ease-out hover:scale-105 hover:animate-glow hover:border-2"
            >
                <div class="flex h-full w-full flex-col items-center justify-center">
                    <h2 class="mt-2 text-center text-2xl font-bold">Back Side</h2>
                    <p class="text-center">More info goes here</p>
                </div>
            </div>
        </div>
    </div>
</div>
