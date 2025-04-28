import { Collections, type AResponse } from '../../../../lib/types/pocketbase-types';
import { serializeNonPOJOs } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const A = serializeNonPOJOs<AResponse[]>(await locals.pb.collection(Collections.A).getFullList());

	return { A };
};