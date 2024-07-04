<script lang="ts">
    import { apiClientSingleton as client } from '$lib/api';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import { Switch } from '$lib/components/ui/switch';
    import { faSpinner } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import { toast } from 'svelte-sonner';
    // import type { PageServerData } from './$types';

    // export let data: PageServerData;

    // $: settings = data.settings;

    // const toggleSetting = (setting: string) => {
    //     if (settings[setting] === undefined) {
    //         console.error(`Setting ${setting} does not exist.`);
    //     }
    //     settings[setting] = !settings[setting];
    // };

    let sessionCleanupInProgress = false;
    const triggerSessionCleanup = async () => {
        sessionCleanupInProgress = true;
        try {
            const response = await client.cronJobs.sessionCleanup();

            console.log(response);
            if (response.success) {
                if (response.data.authSessionsFlushed > 0 || response.data.csrfTokensFlushed > 0) {
                    toast.success(
                        `Successfully removed ${response.data.authSessionsFlushed} expired auth sessions and ${response.data.csrfTokensFlushed} expired csrf tokens.`
                    );
                } else {
                    toast.success('No expired sessions to clean up.');
                }
            } else {
                throw new Error('Failed to trigger session cleanup.');
            }
        } catch (e) {
            toast.error('Failed to trigger session cleanup.');
        }
        sessionCleanupInProgress = false;
    };

    let testRecordCleanupInProgress = false;
    const triggerTestRecordCleanup = async () => {
        testRecordCleanupInProgress = true;
        try {
            const response = await client.testRecords.delete();

            if (response.success) {
                console.log(response.data);
                const totalRecordsDeleted = Object.values(response.data).reduce(
                    (acc, val) => acc + val,
                    0
                );
                if (totalRecordsDeleted > 0) {
                    toast.success(
                        `Successfully removed a total of ${totalRecordsDeleted} test record${totalRecordsDeleted > 1 ? 's' : ''}.`
                    );
                } else {
                    toast.success('No test records to clean up.');
                }
            } else {
                throw new Error('Failed to trigger test record cleanup.');
            }
        } catch (e) {
            toast.error('Failed to trigger test record cleanup.');
        }
        testRecordCleanupInProgress = false;
    };
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
                        <AlertDialog.Cancel>Delete Expired Sessions</AlertDialog.Cancel>
                        <AlertDialog.Action>Cancel</AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>

            <p>Show Seed Records</p>
        </Card.Content>
    </Card.Root>

    <AlertDialog.Root>
        <AlertDialog.Trigger>
            <Button class="flex place-items-center gap-x-2" disabled={sessionCleanupInProgress}>
                {#if sessionCleanupInProgress}
                    <Fa class="animate-spin" icon={faSpinner} size="lg" />
                {/if}
                <span>Cleanup Expired Sessions</span>
            </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Are you sure?</AlertDialog.Title>
                <AlertDialog.Description>
                    Cleaning up expired sessions will delete all expired sessions and CSRF tokens
                    from the database that are past their expiration date. This action cannot be
                    undone.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Cancel on:click={triggerSessionCleanup} variant="destructive"
                    >Delete Expired Sessions</AlertDialog.Cancel
                >
                <AlertDialog.Action>Go Back</AlertDialog.Action>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>

    <AlertDialog.Root>
        <AlertDialog.Trigger>
            <Button class="flex place-items-center gap-x-2" disabled={testRecordCleanupInProgress}>
                {#if testRecordCleanupInProgress}
                    <Fa class="animate-spin" icon={faSpinner} size="lg" />
                {/if}
                <span>Cleanup Test Records</span>
            </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Are you sure?</AlertDialog.Title>
                <AlertDialog.Description>
                    Cleaning up test records will delete all test records from the database. This
                    action cannot be undone.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Cancel on:click={triggerTestRecordCleanup} variant="destructive"
                    >Delete Test Records</AlertDialog.Cancel
                >
                <AlertDialog.Action>Go Back</AlertDialog.Action>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
