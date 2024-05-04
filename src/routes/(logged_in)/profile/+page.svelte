<script lang="ts">
    import type { PageServerData } from './$types';

    import ProfileForm from './profile-form.svelte';

    export let data: PageServerData;
</script>

<ProfileForm user={data.user} />
