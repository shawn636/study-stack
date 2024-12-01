<script lang="ts">
    import AuthFooter from '../auth-footer.svelte';
    import AuthHeader from '../auth-header.svelte';
    import { createForm } from './submit-form.svelte';
    import Divider from '../divider.svelte';
    import LoginForm from './login-form.svelte';
    import OauthButtons from './oauth-buttons.svelte';
    import { page } from '$app/stores';

    const { errors, form, handleChange, handleSubmit, touched } = createForm();

    let registerHref = $page.url.searchParams.get('redirect')
        ? `/auth/register?redirect=${$page.url.searchParams.get('redirect')}`
        : '/auth/register';

    const paramsArray = $page.url.searchParams.entries().toArray();
    const additionalParams = paramsArray
        .filter((param) => param[0] !== 'redirect' && param[0].startsWith('redirect_'))
        .map((param) => `${param[0]}=${param[1]}`)
        .join('&');

    registerHref = additionalParams ? `${registerHref}&${additionalParams}` : registerHref;
</script>

<div class="mx-auto grid w-full max-w-xl items-center justify-items-stretch">
    <div class="grid p-10">
        <AuthHeader
            headerTagline="Please enter your details below to sign in"
            headerText="Sign in"
        />
        <LoginForm {errors} {form} {handleChange} {handleSubmit} {touched} />
        <Divider />
        <OauthButtons />
        <AuthFooter href={registerHref} linkText="Sign up" tagline="Don't have an account?" />
    </div>
</div>
