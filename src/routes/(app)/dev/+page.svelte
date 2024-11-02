<script lang="ts">
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import { Switch } from '$lib/components/ui/switch';

    let checked = $state(false);
</script>

<div class="grid grid-flow-row p-5">
    <h1 class="pb-10 text-2xl font-medium">Currently In Development</h1>

    <div class="border border-dashed border-pink-500 p-4">
        <!-- ENTER CODE BELOW -->

        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Switch bind:checked on:click={(e) => e.preventDefault()} />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                    <AlertDialog.Description>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                    </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action
                        on:click={() => {
                            checked = !checked;
                        }}>Continue</AlertDialog.Action
                    >
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog.Root>

        <!-- ENTER CODE ABOVE -->
    </div>
</div>
