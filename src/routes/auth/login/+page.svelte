<script lang="ts">
	// import { ChevronLeft } from 'svelte-heros-v2';
	import { afterNavigate } from '$app/navigation';

	let email = '';
	let password = '';
	let previousPage = '/';
	let backMessage: 'Go Back' | 'Home' = 'Home';
	afterNavigate(({ from }) => {
		const prev = from?.url.pathname ?? '/';
		if (['/', '/auth/login', '/auth/register'].includes(prev)) {
			previousPage = '/';
			backMessage = 'Home';
		} else {
			previousPage = prev;
			backMessage = 'Go Back';
		}
	});
</script>

<div class="z-10 absolute top-2 left-2 text-sm text-slate-500 hover:text-slate-700">
	<a href={previousPage}>
		<!-- <ChevronLeft
			class="w-4 h-4 mr-1 text-center flex items-center"
			strokeWidth="2"
		/> -->
		{backMessage}
	</a>
</div>

<div class="text-center w-64">
	<div class="py-5">
		<h1 class="text-3xl font-semibold">Welcome back</h1>
		<p class="text-xs text-slate-500">Please enter your details below</p>
	</div>
	<div class="grid grid-flow-row text-md gap-y-4">
		<input
			type="email"
			placeholder="Email"
			bind:value={email}
			class="bg-slate-100 placeholder-gray-500 px-2 py-1 rounded-md"
		/>
		<input
			type="password"
			placeholder="Password"
			bind:value={password}
			class="bg-slate-100 placeholder-gray-500 px-2 py-1 rounded-md"
		/>
		<button
			class="bg-amber-400 rounded-lg py-1 text-md font-medium text-slate-900 hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
			>Sign in</button
		>
	</div>

	<div class="grid grid-cols-[1fr_auto_1fr] items-center py-5">
		<div class="border-b border-slate-300 my-5 border-1" />
		<p class="text-sm text-slate-600 text-center w-10 font-semibold justify-self-center">OR</p>
		<div class="border-b border-slate-300 my-5 border-1" />
	</div>

	<div class="grid grid-flow-row gap-y-3">
		<button
			class="rounded-lg border-slate-300 border py-2 text-md font-semibold text-slate-900 hover:border-2 transition-all duration-300 ease-in-out hover:scale-105"
		>
			<div class="grid justify-items-center">
				<div class="flex grid-cols-[auto_1fr] justify-items-center items-center">
					<img src="/images/google.svg" alt="Google logo" class="w-5 h-5 mx-2 my-0" />
					<div>Sign in with Google</div>
				</div>
			</div>
		</button>

		<button
			class="rounded-lg border-slate-300 border py-2 text-md font-semibold text-slate-900 0 hover:border-2 transition-all duration-300 ease-in-out hover:scale-105"
		>
			<div class="grid justify-items-center">
				<div class="flex grid-cols-[auto_1fr] justify-items-center items-center">
					<img src="/images/facebook.svg" alt="Google logo" class="w-5 h-5 mx-2" />
					<div>Sign in with Facebook</div>
				</div>
			</div>
		</button>

		<button
			class="rounded-lg border-slate-300 border py-2 text-md font-semibold text-slate-900 0 hover:border-2 transition-all duration-300 ease-in-out hover:scale-105"
		>
			<div class="grid justify-items-center">
				<div class="flex grid-cols-[auto_1fr] justify-items-center items-center">
					<img src="/images/apple.svg" alt="Google logo" class="w-5 h-5 mx-2" />
					<div>Sign in with Apple</div>
				</div>
			</div>
		</button>
	</div>
	<p class="text-sm py-2 text-slate-500">
		Don't have an account? <a
			class="text-light-blue-800 font-semibold hover:text-light-blue-700"
			href="/auth/register">Sign up</a
		>
	</p>
</div>
