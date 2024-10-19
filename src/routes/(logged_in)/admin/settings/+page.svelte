<script lang="ts">
    import type { SiteSetting } from '$lib/models/types/database.types';

    import { apiClientSingleton as client } from '$lib/api';
    import { toast } from 'svelte-sonner';

    import type { PageData } from './$types';

    import SessionCleanupCard from './(components)/session-cleanup-card.svelte';
    import SettingCard from './(components)/setting-card.svelte';

    export let data: PageData;

    const updateSiteSetting = async (settingName: string, newValue: boolean) => {
        try {
            const siteSetting = {
                key: settingName,
                recordType: 'PRODUCTION_RECORD',
                value: newValue.toString()
            } as unknown as SiteSetting;
            await client.adminSettings.update(siteSetting);
            toast.success('Site settings updated successfully');
        } catch (error) {
            if (settingName in data.settings) {
                const key = settingName as keyof typeof data.settings;
                data.settings[key] = !newValue;
            }
            if (error instanceof Error) {
                toast.error(`Failed to update site settings: ${error.message}`);
            } else {
                toast.error('Failed to update site settings');
            }
        }
    };
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <div class="col-span-full flex flex-col">
        <h2 class="text-2xl font-bold">General Settings</h2>
        <p>Configure your website settings.</p>
    </div>

    <SettingCard
        alertDescription=" Modifying this setting will change how content is displayed for all users on the site."
        alertTitle="Are you absolutely sure?"
        bind:value={data.settings['display-test-records']}
        description="Enable display of test records across the site."
        on:change={(e) => updateSiteSetting('display-test-records', e.detail)}
        tag="Show Test Records"
        title="Test Records"
    />
    <SettingCard
        alertDescription=" Modifying this setting will change how content is displayed for all users on the site."
        alertTitle="Are you absolutely sure?"
        bind:value={data.settings['display-seed-records']}
        description="Enable display of seed records across the site."
        on:change={(e) => updateSiteSetting('display-seed-records', e.detail)}
        tag="Show Seed Records"
        title="Seed Records"
    />
    <SessionCleanupCard />
</div>
