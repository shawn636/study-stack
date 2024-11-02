<script lang="ts">
    import type { PageServerData } from './$types';

    import ProfileForm from './profile-form.svelte';

    interface Props {
        data: PageServerData;
    }

    let { data }: Props = $props();
</script>

<ProfileForm user={data.user} />
