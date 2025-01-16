<script lang="ts">
    import BlakeDevCard from './(team-members)/(blake-mcallister)/blake-dev-card.svelte';
    import ShawnDevCard from './(team-members)/(shawn-long)/shawn-dev-card.svelte';
    import TeamMemberCard from './(components)/team-member-card.svelte';
</script>

<main
    class="mx-10 mb-10 mt-5 grid max-w-5xl grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:mx-auto"
>
    <div class="col-span-full grid gap-y-5">
        <h1 class="text-3xl font-bold">Meet the Devs</h1>
        <p class="rounded bg-stone-100 p-4 dark:bg-slate-800">
            Welcome to the heart of our team—our amazing developers! 🎉 We’re incredibly proud of
            the talented folks who bring creativity, code, and collaboration to every project. Each
            dev plays a crucial role in turning ideas into reality, and we’re so grateful for their
            hard work and passion. Get to know the brilliant minds behind the keyboard and why we’re
            so lucky to have them on board!
        </p>
    </div>

    <TeamMemberCard>
        <ShawnDevCard />
    </TeamMemberCard>

    <TeamMemberCard>
        <BlakeDevCard />
    </TeamMemberCard>
</main>
