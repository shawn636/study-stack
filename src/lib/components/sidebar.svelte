<script lang="ts">
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { headerLinks } from '$lib/header-links';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	$: classesActive = (href: string) =>
		href === $page.url.pathname ? '!bg-primary-500 !text-white' : '';
</script>

<Drawer width="w-64">
	<div class="grid h-full p-4">
		<div class="container space-y-4">
			<nav class="list-nav">
				<ul>
					{#each headerLinks as link}
						<li>
							<a
								on:click={drawerStore.close}
								href={link.href}
								class="flex-auto {classesActive(link.href)}">{link.name}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
			<a href="/auth/login" class="btn variant-soft w-full"> Sign In </a>
			<a href="/auth/register" class="btn variant-filled w-full"> Register </a>
		</div>
		<LightSwitch rounded="rounded-full justify-self-end self-end" />
	</div>
</Drawer>
