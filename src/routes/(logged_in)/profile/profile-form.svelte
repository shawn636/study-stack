<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import { phone, submitForm, updatePhoneNumber } from './profile-form';

    import { Button } from '$lib/components/ui/button';
    import { apiClientSingleton as client } from '$lib/api';
    import Fa from 'svelte-fa';
    import { faSpinner } from '@fortawesome/free-solid-svg-icons';
    import { formatPhoneNumber } from '$lib/client/util';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { onMount } from 'svelte';
    import { Textarea } from '$lib/components/ui/textarea';
    import { toast } from 'svelte-sonner';

    interface Props {
        user: User;
    }

    let { user = $bindable() }: Props = $props();
    let profilePhotoFile: File;
    let isUpdating = $state(false);

    onMount(() => {
        phone.set(formatPhoneNumber((user?.areaCode ?? '') + (user?.phoneNumber ?? '')));
    });

    const saveChanges = async () => {
        isUpdating = true;
        const phoneTemp = $phone.replace(/\s/g, '');
        user.areaCode = phoneTemp.slice(0, 3) === '' ? null : phoneTemp.slice(0, 3);
        user.phoneNumber = phoneTemp.slice(3, 10) === '' ? null : phoneTemp.slice(3, 10);
        user.countryCode = user.areaCode ? '+1' : null;

        if (profilePhotoFile) {
            const result = await client.users.uploadPhoto(user.id, profilePhotoFile);

            if (!result.success) {
                toast.error('Failed to upload photo');
                isUpdating = false;
                return;
            }
            user.photoImageId = result.data.imageId;
            user.photoUrl = result.data.imageUrl;
        }

        const updatedUser = await submitForm(user);
        if (updatedUser) {
            user = updatedUser;
        }
        isUpdating = false;
    };

    const onFileChanged = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        if (event.currentTarget && event.currentTarget.files) {
            profilePhotoFile = event.currentTarget.files[0];
        }
    };
</script>

<form class="space-y-8">
    <div class="space-y-2">
        <Label for="name">Name</Label>
        <Input bind:value={user.name} id="name" placeholder="Name" type="text" />
    </div>

    <div class="space-y-2">
        <Label for="phone">Phone</Label>
        <Input
            id="phone"
            maxlength={12}
            on:input={updatePhoneNumber}
            placeholder="123 456 7890"
            type="tel"
            value={$phone}
        />
    </div>

    <div class="space-y-2">
        <Label for="city">City</Label>
        <Input bind:value={user.city} id="city" placeholder="City" type="text" />
    </div>

    <div class="space-y-2">
        <Label for="state">State</Label>
        <Input bind:value={user.state} id="state" placeholder="State" type="text" />
    </div>

    <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="picture">Picture</Label>
        <Input id="picture" on:change={onFileChanged} type="file" />
        {#if user.photoUrl}
            <img alt="Profile" class="mt-2 h-24 w-24 rounded-lg" src={user.photoUrl} />
        {/if}
    </div>

    <div class="space-y-2">
        <Label for="bio">Bio</Label>
        <Textarea bind:value={user.bio} id="bio" />
    </div>

    <Button class="palce-items-center flex gap-x-2" disabled={isUpdating} on:click={saveChanges}>
        {#if isUpdating}
            <Fa class="animate-spin" icon={faSpinner} />
        {/if}
        <span>Update profile</span>
    </Button>
</form>
