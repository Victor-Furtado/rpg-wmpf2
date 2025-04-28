import type { TypedPocketBase } from './lib/types/pocketbase-types';
import { serializeNonPOJOs } from '$lib/utils';
import PocketBase from 'pocketbase';

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('https://pf2r-br.pockethost.io/') as TypedPocketBase;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	// await event.locals.pb.admins.authWithPassword(import.meta.env.VITE_PB_ADMIN, import.meta.env.VITE_PB_ADMIN_PW, { autoRefreshThreshold: 30 * 60 });

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};