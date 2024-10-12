<script lang="ts">
    import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
    import Fa from 'svelte-fa';

    import Avatar from './avatar.svelte';

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
</script>

<div
    class="h-full w-full rounded-xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-4 text-white shadow-md"
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
</div>
