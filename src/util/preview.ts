import {TFunction} from 'react-i18next';
import {storyFromTwee} from './twee';

const getDisclaimerStorageKey = (storyUrl: URL|string) => `twine-approved-disclaimer-${storyUrl}`;

/**
 * Shows disclaimer prompt
 */
export function showDisclaimer(t: TFunction<string>, storyUrl: URL|string) {
	const storageKey = getDisclaimerStorageKey(storyUrl);
	if (localStorage.getItem(storageKey)) return true;
	if (window.confirm(t('routes.preview.disclaimerPrompt'))) {
		localStorage.setItem(storageKey, 'true');
		return true;
	};
}

/**
 * Prevents disclaimer prompt from showing
 */
export function preventDisclaimer(storyUrl: URL|string) {
	const storageKey = getDisclaimerStorageKey(storyUrl);
	localStorage.setItem(storageKey, 'true');
}

/**
 * Downloads file from URL and parses the stories from it
 */
export function storiesFromUrl(url: URL|string, preview?: boolean) {
	return fetch(url)
		.then((res) => res.text())
		.then((data) => [preview ? storyFromTwee(data, `url:${url}`, true) : storyFromTwee(data)]);
}
