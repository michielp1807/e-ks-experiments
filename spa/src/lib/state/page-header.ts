import { writable } from 'svelte/store';
import type { DistrictCode } from '$lib/types';

export interface PageHeaderState {
	title: string;
	subtitle: string;
	districts: DistrictCode[];
	backHref: '' | '/' | '/candidate-lists' | '/candidates';
	backLabel: string;
}

export const emptyPageHeader: PageHeaderState = {
	title: '',
	subtitle: '',
	districts: [],
	backHref: '',
	backLabel: 'Terug'
};

export const pageHeader = writable<PageHeaderState>(emptyPageHeader);
