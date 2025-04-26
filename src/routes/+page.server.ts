import { Collections } from '$lib/types/pocketbase-types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	locals.pb.authStore.clear();
	locals.user = undefined;
	
};

export const actions = {
	login: async ({ request, locals }) => {
		const {user, pass} = Object.fromEntries(await request.formData()) as { [k: string]: string; };

		try {
			await locals.pb.collection(Collections.Users).authWithPassword(`${user}@p.f`, pass)
		} catch (err) {
			console.log('Error: ', err);
			return { error: 'Usuário ou senha incorretos' }
		}
		
		throw redirect(303, '/a/');
	},
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
		locals.user = undefined;

		throw redirect(303, '/');
	}
};