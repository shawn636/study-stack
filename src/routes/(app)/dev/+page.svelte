<script lang="ts">
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
    import { createForm } from 'svelte-forms-lib';
    import { object, string, ref } from 'yup';

    let cards = [1, 2];

    let currCardIndex = 0;
    let prevCardIndex = 0;
    $: transitionTo = currCardIndex > prevCardIndex ? 'left' : 'right';

    // let name = '';
    // let email = '';
    // let password1 = '';
    // let password2 = '';

    const { form, errors, touched, handleChange, handleSubmit } = createForm({
        initialValues: {
            name: '',
            email: '',
            password1: '',
            password2: ''
        },
        validationSchema: object().shape({
            name: string().required(),
            email: string().email().required(),
            password1: string()
                .min(8)
                .matches(/[a-z]/, 'Password must contain a lowercase letter')
                .matches(/[A-Z]/, 'Password must contain an uppercase letter')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain a special symbol')
                .required(),
            password2: string()
                .oneOf([ref('password1')], 'Passwords must match')
                .required()
        }),
        onSubmit: (values) => {
            alert(JSON.stringify(values));
        }
    });

    const nextCard = () => {
        if (currCardIndex < cards.length - 1) {
            prevCardIndex = currCardIndex;
            currCardIndex++;
        }
    };
    const previousCard = () => {
        if (currCardIndex > 0) {
            prevCardIndex = currCardIndex;
            currCardIndex--;
        }
    };
</script>

<div class="grid grid-flow-row p-5">
    <h1 class="text-2xl font-medium pb-10">Currently In Development</h1>
    <div class="border-pink-500 border border-dashed grid justify-items-start">
        <!-- ENTER CODE BELOW -->
        <div class="grid justify-items-center items-center w-full space-y-4">
            <!-- Controls -->
            <div class="grid grid-cols-2 justify-items-center items-center gap-2">
                <button
                    disabled={currCardIndex === 0}
                    on:click={previousCard}
                    type="button"
                    class="btn btn-icon rounded-lg variant-filled-surface"
                >
                    <Fa icon={faAngleLeft} size="20" />
                </button>
                <button
                    disabled={currCardIndex === cards.length - 1}
                    on:click={nextCard}
                    type="button"
                    class="btn btn-icon rounded-lg variant-filled-surface"
                >
                    <Fa icon={faAngleRight} size="20" />
                </button>
            </div>

            <!-- Form Data -->
            <!-- <div class="text-start w-72">
                <h3 class="text-center">Form Data</h3>
                <p>{name !== '' ? name : 'null'}</p>
                <p>{email !== '' ? email : 'null'}</p>
                <p>{password1 !== '' ? password1 : 'null'}</p>
                <p>{password2 !== '' ? password2 : 'null'}</p>
            </div> -->

            <!-- First Form -->

            <form on:submit={handleSubmit}>
                {#if currCardIndex == 0}
                    <div
                        class="card p-10 space-y-4"
                        in:fly={{
                            x: transitionTo === 'left' ? '100%' : '-100%',
                            duration: 300,
                            delay: 300,
                            easing: cubicInOut
                        }}
                        out:fly={{
                            x: transitionTo === 'left' ? '-100%' : '100%',
                            duration: 300,
                            easing: cubicInOut
                        }}
                    >
                        <h3 class="h3">Form 1</h3>
                        <input
                            type="text"
                            class="input"
                            name="name"
                            placeholder="Name"
                            on:change={handleChange}
                            on:blur={handleChange}
                            bind:value={$form.name}
                        />
                        {#if $errors.name}
                            <small>{$errors.name}</small>
                        {/if}
                        <input
                            type="email"
                            class="input"
                            name="email"
                            placeholder="Email"
                            on:change={handleChange}
                            on:blur={handleChange}
                            bind:value={$form.email}
                        />
                        {#if $errors.email}
                            <small>{$errors.email}</small>
                        {/if}
                        <button
                            type="button"
                            on:click={previousCard}
                            class="btn variant-filled-surface"
                            disabled
                        >
                            Go Back
                        </button>
                        <button
                            type="button"
                            on:click={() => {
                                if (
                                    $touched.name &&
                                    $touched.email &&
                                    !$errors.name &&
                                    !$errors.email
                                )
                                    nextCard();
                            }}
                            class="btn variant-filled-primary"
                        >
                            Continue
                        </button>
                    </div>
                    <!-- Second Form -->
                {:else}
                    <div
                        class="card p-10 space-y-4"
                        in:fly={{
                            x: transitionTo === 'left' ? '100%' : '-100%',
                            duration: 300,
                            delay: 300,
                            easing: cubicInOut
                        }}
                        out:fly={{
                            x: transitionTo === 'left' ? '-100%' : '100%',
                            duration: 300,
                            easing: cubicInOut
                        }}
                    >
                        <h3 class="h3">Form 2</h3>
                        <input
                            type="password"
                            class="input"
                            name="password1"
                            placeholder="Enter a password"
                            on:change={handleChange}
                            on:blur={handleChange}
                            bind:value={$form.password1}
                        />
                        {#if $errors.password1}
                            <small>{$errors.password1}</small>
                        {/if}
                        <input
                            type="password"
                            class="input"
                            name="password2"
                            placeholder="Confirm your password"
                            on:change={handleChange}
                            on:blur={handleChange}
                            bind:value={$form.password2}
                        />
                        {#if $errors.password2}
                            <small>{$errors.password2}</small>
                        {/if}
                        <button
                            type="button"
                            on:click={previousCard}
                            class="btn variant-filled-surface"
                        >
                            Go Back
                        </button>
                        <button type="submit" class="btn btn-primary variant-filled-primary">
                            Submit
                        </button>
                    </div>
                {/if}
            </form>
        </div>
        <!-- ENTER CODE ABOVE -->
    </div>
</div>
