<script lang="ts">
    export let href: string;
    export let tagline: string;
    export let linkText: string;
</script>

<p class="py-2 text-center text-sm text-primary/70">
    {tagline}
    <a class="text-primary-500 hover:text-primary-600 font-semibold" {href}>{linkText}</a>
</p>
