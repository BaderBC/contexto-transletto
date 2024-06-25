import { writable } from 'svelte/store';

export const currentPath = writable('');

export const navigate = currentPath.set;
