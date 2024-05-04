<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import { formatPhoneNumber } from '$lib/client/util';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Textarea } from '$lib/components/ui/textarea';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';

    import { phone, submitForm, updatePhoneNumber } from './profile-form';

    export let user: User;
    let profilePhotoFile: File;

    onMount(() => {
        phone.set(formatPhoneNumber((user?.areaCode ?? '') + (user?.phoneNumber ?? '')));
    });

    const saveChanges = async () => {
        const phoneTemp = $phone.replace(/\s/g, '');
        user.areaCode = phoneTemp.slice(0, 3) === '' ? null : phoneTemp.slice(0, 3);
        user.phoneNumber = phoneTemp.slice(3, 10) === '' ? null : phoneTemp.slice(3, 10);
        user.countryCode = user.areaCode ? '+1' : null;

        const updatedPhoto = await uploadPhoto();
        if (!updatedPhoto.ok) {
            toast.error('Failed to upload photo');
            return;
        }

        const updatedUser = await submitForm(user);
        if (updatedUser) {
            user = updatedUser;
        }
    };

    const uploadPhoto = async (): Promise<Response> => {
        const formData = new FormData();
        formData.append('profilePhoto', profilePhotoFile);
        formData.append('userId', user.id);

        const response = await fetch('/api/user/photo', {
            body: formData,
            method: 'POST'
        });

        return response;
    };

    const onFileChanged = (event: { currentTarget: EventTarget & HTMLInputElement } & Event) => {
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
    </div>

    <div class="space-y-2">
        <Label for="bio">Bio</Label>
        <Textarea bind:value={user.bio} id="bio" />
    </div>

    <Button on:click={saveChanges}>Update profile</Button>
</form>
