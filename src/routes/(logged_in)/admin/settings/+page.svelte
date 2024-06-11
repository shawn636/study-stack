<script lang="ts">
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import * as Card from '$lib/components/ui/card';
    import { Switch } from '$lib/components/ui/switch';

    // import type { PageServerData } from './$types';

    // export let data: PageServerData;

    // $: settings = data.settings;

    // const toggleSetting = (setting: string) => {
    //     if (settings[setting] === undefined) {
    //         console.error(`Setting ${setting} does not exist.`);
    //     }
    //     settings[setting] = !settings[setting];
    // };
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <div class="col-span-full flex flex-col">
        <h2 class="text-2xl font-bold">General Settings</h2>
        <p>Configure your website settings.</p>
    </div>

    <Card.Root>
        <Card.Header>
            <Card.Title>Test Records</Card.Title>
            <Card.Description>Enable display of test records across the site.</Card.Description>
        </Card.Header>
        <Card.Content class="flex gap-2">
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <!-- <Switch
                        bind:checked={settings['display-test-records']}
                        on:click={(e) => e.preventDefault()}
                    /> -->
                    <Switch />
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description>
                            Modifying this setting will change how content is displayed for
                            <strong>all users</strong> on the site.
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <!-- <AlertDialog.Action on:click={() => toggleSetting('display-test-records')}>
                            Continue
                        </AlertDialog.Action> -->
                        <AlertDialog.Action>Continue</AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>

            <p>Show Seed Records</p>
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Seed Records</Card.Title>
            <Card.Description>Enable display of seed records across the site.</Card.Description>
        </Card.Header>
        <Card.Content class="flex gap-2">
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <!-- <Switch
                        bind:checked={settings['display-seed-records']}
                        on:click={(e) => e.preventDefault()}
                    /> -->
                    <Switch />
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description>
                            Modifying this setting will change how content is displayed for
                            <strong>all users</strong> on the site.
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <!-- <AlertDialog.Action on:click={() => toggleSetting('display-seed-records')}>
                            Continue
                        </AlertDialog.Action> -->
                        <AlertDialog.Action>Continue</AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>

            <p>Show Seed Records</p>
        </Card.Content>
    </Card.Root>
</div>
