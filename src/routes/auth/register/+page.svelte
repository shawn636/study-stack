<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
	import {
		faChevronLeft,
		faCircleExclamation,
		faEye,
		faEyeSlash
	} from '@fortawesome/free-solid-svg-icons';
	import { object, string, ref } from 'yup';
	import { fly, slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { createForm } from 'svelte-forms-lib';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	// Controls
	let showPassword1 = false;
	let showPassword2 = false;

	const toggleShow1 = () => {
		showPassword1 = !showPassword1;
	};

	const toggleShow2 = () => {
		showPassword2 = !showPassword2;
	};

	// Form Validation
	const { form, errors, isValid, touched, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
			email: '',
			password1: '',
			password2: ''
		},
		validationSchema: object().shape({
			name: string().required('Please enter your name.'),
			email: string()
				.email('Oops! The email you entered is invalid.')
				.matches(
					/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
					'Oops! The email you entered is invalid.'
				)
				.required('Please enter your email address.'),
			password1: string()
				.min(8, 'Password should have at least 8 characters')
				.matches(/[a-z]/, 'Password should contain a lowercase letter')
				.matches(/[A-Z]/, 'Password should contain an uppercase letter')
				.matches(/[0-9]/, 'Password should contain a number')
				.required('Please enter your password.'),
			password2: string()
				.oneOf([ref('password1')], 'Passwords should match.')
				.required('Please confirm your password.')
		}),
		onSubmit: async (values) => {
			isSubmitting = true;
			const res = await submitForm(values);
			isSubmitting = false;

			const responseText = await res?.text();
			const succeeded = res?.ok;

			if (succeeded) {
				submissionError = 'Nailed it!';
				goto('/');
			} else {
				submissionError = responseText ?? 'An error occurred. Please try again.';
			}
		}
	});

	let isSubmitting = false;
	let submissionError: string | null = null;

	const submitForm = async (
		values: {
			name: string;
			email: string;
			password1: string;
			password2: string;
		} | null
	) => {
		if (values) {
			const formData = new FormData();
			formData.append('name', values.name);
			formData.append('email', values.email);
			formData.append('password1', values.password1);
			formData.append('password2', values.password2);

			const res = await fetch('/auth/register', {
				method: 'POST',
				body: formData
			});

			return res;
		}

		return null;
	};

	// Form Transitions
	const transitionDuration = 300;
	const formCount = 2;

	let currFormIndex = 0;
	let prevFormIndex = 0; // to determine transition animation dir

	$: transitionTo = currFormIndex > prevFormIndex ? 'right' : 'left';

	const nextForm = () => {
		if (!$touched.name) {
			$errors.name = 'Please enter your name.';
		}
		if (!$touched.email) {
			$errors.email = 'Please enter your email address.';
		}

		if (!$errors.name && !$errors.email && currFormIndex < formCount - 1) {
			prevFormIndex = currFormIndex;
			currFormIndex++;
		}
	};

	const prevForm = () => {
		if (currFormIndex > 0) {
			prevFormIndex = currFormIndex;
			currFormIndex--;
		}
	};
</script>

{#if submissionError}
	<p>{submissionError}</p>
{/if}

<form class="h-full grid items-center w-full" id="register-form" on:submit={handleSubmit}>
	{#if currFormIndex == 0}
		<div
			class="grid justify-items-center items-center h-full row-start-1 row-end-2 col-start-1 col-end-2"
			id="main"
			in:fly={{
				x: transitionTo === 'right' ? '100%' : '-100%',
				duration: transitionDuration,
				delay: transitionDuration,
				easing: cubicInOut
			}}
			out:fly={{
				x: transitionTo === 'right' ? '-100%' : '100%',
				duration: transitionDuration,
				easing: cubicInOut
			}}
		>
			<div class="grid items-center">
				<a
					href="/"
					class="btn btn-iconn text-surface-700 dark:text-surface-300 justify-start flex items-center text-center gap-1 p-1"
				>
					<Fa icon={faChevronLeft} />
					Home
				</a>
				<div class="card shadow-lg p-10 w-full grid justify-items-center">
					<div class="text-center">
						<!-- Header -->
						<div class="py-5">
							<h1 class="h1 font-semibold">Welcome to Equipped</h1>
							<p class="text-xs text-slate-500">Please enter your details below</p>
						</div>

						<div class="grid grid-flow-row text-md gap-y-4">
							<div>
								<input
									type="text"
									name="name"
									placeholder="Name"
									class="input
										{$errors.name ? 'border-error-500' : ''}
										{!$errors.name && $touched.name ? 'border-success-700' : ''}"
									on:change={handleChange}
									on:blur={handleChange}
									bind:value={$form.name}
								/>
								{#if $errors.name}
									<div
										class="flex items-center gap-x-1"
										in:slide|local={{
											duration: 300,
											easing: cubicInOut
										}}
										out:slide|local={{
											duration: 300,
											easing: cubicInOut
										}}
									>
										<Fa icon={faCircleExclamation} size="16" class="text-error-500" />
										<small class="text-error-500">{$errors.name}</small>
									</div>
								{/if}
							</div>

							<input
								type="email"
								name="email"
								placeholder="Email"
								on:change={handleChange}
								on:blur={handleChange}
								bind:value={$form.email}
								class="input
										{$errors.email ? 'border-error-500' : ''}
										{!$errors.email && $touched.name ? 'border-success-700' : ''}"
							/>
							{#if $errors.email}
								<div
									class="flex items-center gap-x-1"
									in:slide|local={{
										duration: 300,
										easing: cubicInOut
									}}
									out:slide|local={{
										duration: 300,
										easing: cubicInOut
									}}
								>
									<Fa icon={faCircleExclamation} size="16" class="text-error-500" />
									<small class="text-error-500">{$errors.email}</small>
								</div>
							{/if}
							<button
								type="button"
								aria-label="continue"
								on:click={nextForm}
								class="btn variant-filled-secondary font-medium">Continue</button
							>
						</div>

						<!-- Divider -->

						<div class="grid grid-cols-[1fr_auto_1fr] items-center py-5">
							<hr />
							<p
								class="text-sm px-2 font-semibold uppercase text-surface-500 dark:text-surface-400"
							>
								or
							</p>
							<hr />
						</div>

						<!-- OAuth Buttons -->
						<div class="grid grid-flow-row gap-y-3">
							<button type="button" class="btn variant-soft">
								<Fa icon={faGoogle} size="20" />
								<span>Sign up with Google</span>
							</button>

							<button type="button" class="btn variant-soft">
								<Fa icon={faFacebook} size="20" />
								<span>Sign up with Facebook</span>
							</button>

							<button type="button" class="btn variant-soft">
								<Fa icon={faApple} size="20" />
								<span>Sign up with Apple</span>
							</button>
						</div>
						<p class="text-sm py-2 text-slate-500">
							Already have an account? <a
								class="text-primary-500 font-semibold hover:text-primary-600"
								href="/auth/login">Sign in</a
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div
			class="grid justify-items-center items-center h-full row-start-1 row-end-2 col-start-1 col-end-2"
			in:fly={{
				x: transitionTo === 'right' ? '100%' : '-100%',
				duration: transitionDuration,
				delay: transitionDuration,
				easing: cubicInOut
			}}
			out:fly={{
				x: transitionTo === 'right' ? '-100%' : '100%',
				duration: transitionDuration,
				easing: cubicInOut
			}}
		>
			<div class="grid grid-items-center">
				<a
					href="/"
					class="btn btn-iconn text-surface-700 dark:text-surface-300 justify-start flex items-center text-center gap-1 p-1"
				>
					<Fa icon={faChevronLeft} />
					Home
				</a>
				<div class="card shadow-lg p-10 w-[360px] grid justify-items-center">
					<!-- Header -->
					<div class="py-5">
						<h1 class="h1 font-semibold">Select a password</h1>
					</div>
					<!-- Form 2 -->
					<div class="grid w-full grid-flow-row text-md gap-y-4 justify-items-stretch">
						{#if showPassword1}
							<div class="flex">
								<input
									type="text"
									name="password1"
									placeholder="Enter a password"
									on:change={handleChange}
									on:blur={handleChange}
									bind:value={$form.password1}
									class="input rounded-r-none"
									required
								/>
								<button
									type="button"
									on:click={toggleShow1}
									class="btn-icon rounded-l-none rounded-r-lg variant-filled-primary"
									><Fa icon={faEyeSlash} size="16" /></button
								>
							</div>
						{:else}
							<div class="flex">
								<input
									type="password"
									name="password1"
									placeholder="Enter a password"
									on:change={handleChange}
									on:blur={handleChange}
									bind:value={$form.password1}
									class="input rounded-r-none"
									required
								/>
								<button
									type="button"
									on:click={toggleShow1}
									class="btn-icon rounded-l-none rounded-r-lg variant-filled-primary"
									><Fa icon={faEye} size="16" /></button
								>
							</div>
						{/if}
						{#if $errors.password1}
							<div
								class="flex items-center gap-x-1"
								in:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
								out:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
							>
								<Fa icon={faCircleExclamation} size="16" class="text-error-500" />
								<small class="text-error-500">{$errors.password1}</small>
							</div>
						{/if}
						{#if showPassword2}
							<div class="flex">
								<input
									type="text"
									name="password2"
									placeholder="Enter a password"
									on:change={handleChange}
									on:blur={handleChange}
									bind:value={$form.password2}
									class="input rounded-r-none"
									required
								/>
								<button
									type="button"
									on:click={toggleShow2}
									class="btn-icon rounded-l-none rounded-r-lg variant-filled-primary"
									><Fa icon={faEyeSlash} size="16" /></button
								>
							</div>
						{:else}
							<div class="flex">
								<input
									type="password"
									name="password2"
									placeholder="Enter a password"
									on:change={handleChange}
									on:blur={handleChange}
									bind:value={$form.password2}
									class="input rounded-r-none"
									required
								/>
								<button
									type="button"
									on:click={toggleShow2}
									class="btn-icon rounded-l-none rounded-r-lg variant-filled-primary"
									><Fa icon={faEye} size="16" /></button
								>
							</div>
						{/if}
						{#if $errors.password2}
							<div
								class="flex items-center gap-x-1"
								in:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
								out:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
							>
								<Fa icon={faCircleExclamation} size="16" class="text-error-500" />
								<small class="text-error-500">{$errors.password2}</small>
							</div>
						{/if}
						<button
							type="submit"
							class="btn variant-filled-secondary font-medium flex gap-2"
							disabled={!$isValid || isSubmitting}
						>
							{#if isSubmitting}
								<ProgressRadial width="w-6" stroke={100} />
							{:else}
								Submit
							{/if}
						</button>
						<button type="button" on:click={prevForm} class="btn variant-filled-surface font-medium"
							>Go Back</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</form>
