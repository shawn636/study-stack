<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
	import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
	import { object, string, ref } from 'yup';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	// Form Validation
	let name = '';
	let email = '';
	let password1 = '';
	let password2 = '';

	let userSchema = object().shape({
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
	});
	let errors = {};

	const validateForm = async () => {
		try {
			await userSchema.validate({ name, email, password1, password2 }, { abortEarly: false });
			console.log('Form is valid');
		} catch (error: any) {
			if (error.name === 'ValidationError') {
				errors = error.inner.reduce((acc: any, validationError: any) => {
					acc[validationError.path] = validationError.message;
					return acc;
				}, {});
			}
		}
	};

	// Form Transitions
	const transitionDuration = 300;

	const formCount = 2;

	let currFormIndex = 0;
	let prevFormIndex = 0;
	$: transitionTo = currFormIndex > prevFormIndex ? 'right' : 'left';

	const nextForm = () => {
		if (currFormIndex < formCount - 1) {
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

<form class="h-full grid items-center w-full" id="register-form">
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
				<div class="card shadow-lg p-10 w-[360px] grid justify-items-center">
					<div class="text-center w-64">
						<!-- Header -->
						<div class="py-5">
							<h1 class="h1 font-semibold">Welcome</h1>
							<p class="text-xs text-slate-500">Please enter your details below</p>
						</div>

						<div class="grid grid-flow-row text-md gap-y-4">
							<input type="text" placeholder="Name" bind:value={name} class="input" required />
							<input type="email" placeholder="Email" bind:value={email} class="input" required />
							<button
								type="button"
								on:click={nextForm}
								class="btn variant-filled-secondary font-medium">Continue</button
							>
							<button type="button" class="btn variant-filled-surface font-medium" disabled
								>Go Back</button
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
						<h1 class="h1 font-semibold">Welcome</h1>
						<p class="text-xs text-slate-500">Please enter your details below</p>
					</div>
					<!-- Form 2 -->
					<div class="grid grid-flow-row text-md gap-y-4">
						<input
							type="password"
							placeholder="Enter a password"
							bind:value={password1}
							class="input"
							required
						/>
						<input
							type="password"
							placeholder="Confirm your password"
							bind:value={password2}
							class="input"
							required
						/>
						<button type="submit" class="btn variant-filled-secondary font-medium">Submit</button>
						<button type="button" on:click={prevForm} class="btn variant-filled-surface font-medium"
							>Go Back</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</form>
