import { browser } from '$app/environment';

const STORAGE_KEY = 'eks-spa-overlay-family';

type RouteParams = {
	id?: string;
	personId?: string;
};

export function overlayFamily(routeId: string | null | undefined, params: RouteParams): string | null {
	if (!routeId) {
		return null;
	}

	if (
		routeId === '/candidate-lists/[id]/candidates/[personId]' ||
		routeId === '/candidate-lists/[id]/candidates/[personId]/details' ||
		routeId === '/candidate-lists/[id]/candidates/[personId]/address' ||
		routeId === '/candidate-lists/[id]/candidates/[personId]/representative'
	) {
		if (params.id && params.personId) {
			return `candidate:${params.id}:${params.personId}`;
		}

		return null;
	}

	if (
		routeId === '/candidate-lists/[id]/candidates/add' ||
		routeId === '/candidate-lists/[id]/candidates/new'
	) {
		if (params.id) {
			return `candidate-list-add:${params.id}`;
		}

		return null;
	}

	if (routeId === '/candidate-lists/[id]/details' || routeId === '/candidate-lists/[id]/submitters') {
		if (params.id) {
			return `candidate-list:${params.id}`;
		}

		return null;
	}

	return null;
}

export function shouldAnimateOverlay(routeId: string | null | undefined, params: RouteParams): boolean {
	if (!browser) {
		return false;
	}

	const family = overlayFamily(routeId, params);
	if (!family) {
		return false;
	}

	return sessionStorage.getItem(STORAGE_KEY) !== family;
}

export function markOverlayFamily(routeId: string | null | undefined, params: RouteParams) {
	if (!browser) {
		return;
	}

	const family = overlayFamily(routeId, params);
	if (family) {
		sessionStorage.setItem(STORAGE_KEY, family);
	}
}

export function clearOverlayFamily(routeId: string | null | undefined, params: RouteParams) {
	if (!browser) {
		return;
	}

	if (!overlayFamily(routeId, params)) {
		sessionStorage.removeItem(STORAGE_KEY);
	}
}
