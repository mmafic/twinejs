import {usePublishing} from './use-publishing';
import {isElectronRenderer} from '../util/is-electron';
import {TwineElectronWindow} from '../electron/shared';

export interface UseStoryLaunchProps {
	playStory: (storyId: string) => Promise<void>;
	proofStory: (storyId: string) => Promise<void>;
	testStory: (storyId: string, startPassageId?: string) => Promise<void>;
}

function parseStoryId(storyId: string) {
	const parts = storyId.split('url:');
	if (parts.length < 2) return { preview: false };
	return { preview: true, storyUrl: parts[1] };
}

/**
 * Provides functions to launch a story that include the correct handling for
 * both web and Electron contexts.
 */
export function useStoryLaunch(): UseStoryLaunchProps {
	const {proofStory, publishStory} = usePublishing();

	if (isElectronRenderer()) {
		const {twineElectron} = window as TwineElectronWindow;

		if (!twineElectron) {
			throw new Error('Electron bridge is not present on window.');
		}

		// These are async to match the type in the browser context.

		return {
			playStory: async storyId => {
				twineElectron.openWithScratchFile(
					await publishStory(storyId),
					`play-${storyId}.html`
				);
			},
			proofStory: async storyId => {
				twineElectron.openWithScratchFile(
					await proofStory(storyId),
					`proof-${storyId}.html`
				);
			},
			testStory: async (storyId, startPassageId) => {
				twineElectron.openWithScratchFile(
					await publishStory(storyId, {
						formatOptions: 'debug',
						startId: startPassageId
					}),
					`test-${storyId}.html`
				);
			}
		};
	}

	return {
		playStory: async storyId => {
			const { preview, storyUrl } = parseStoryId(storyId);
			let uri = preview ? '#/preview/play' : `#/stories/${storyId}/play`;
			if (preview) uri += `?url=${storyUrl}`;
			window.open(uri, '_blank');
		},
		proofStory: async storyId => {
			const { preview, storyUrl } = parseStoryId(storyId);
			let uri = preview ? '#/preview/proof' : `#/stories/${storyId}/proof`;
			if (preview) uri += `?url=${storyUrl}`;
			window.open(uri, '_blank');
		},
		testStory: async (storyId, startPassageId) => {
			const { preview, storyUrl } = parseStoryId(storyId);
			let uri = preview ? '#/preview/test' : `#/stories/${storyId}/test`;
			if (startPassageId) uri += `/${startPassageId}`;
			if (preview) uri += `?url=${storyUrl}`;
			window.open(uri, '_blank');
		}
	};
}
