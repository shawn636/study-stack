<script lang="ts">
    interface Props {
        headerText: string;
        headerTagline: string;
    }

    let { headerText, headerTagline }: Props = $props();
</script>

<div class="py-5 text-center">
    <h2 class="text-3xl font-semibold" data-testid="auth-header">{headerText}</h2>
    <p class="my-2 text-xs text-slate-500">{headerTagline}</p>
</div>
