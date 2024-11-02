<script lang="ts">
    interface Props {
        href: string;
        tagline: string;
        linkText: string;
    }

    let { href, tagline, linkText }: Props = $props();
</script>

<p class="py-2 text-center text-sm text-primary/70">
    {tagline}
    <a class="text-primary-500 hover:text-primary-600 font-semibold" {href}>{linkText}</a>
</p>
