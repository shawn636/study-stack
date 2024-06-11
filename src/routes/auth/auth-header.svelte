<script lang="ts">
    export let headerText: string;
    export let headerTagline: string;
</script>

<div class="py-5 text-center">
    <h2 class="text-3xl font-semibold" data-testid="auth-header">{headerText}</h2>
    <p class="my-2 text-xs text-slate-500">{headerTagline}</p>
</div>
