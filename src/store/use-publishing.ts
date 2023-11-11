import * as React from 'react';
import {
	publishArchive,
	publishStory,
	publishStoryWithFormat,
	PublishOptions
} from '../util/publish';
import {usePrefsContext} from './prefs';
import {
	formatWithNameAndVersion,
	loadFormatProperties,
	useStoryFormatsContext
} from './story-formats';
import {Story, storyWithId, useStoriesContext} from './stories';
import {getAppInfo} from '../util/app-info';

export interface UsePublishingProps {
	proofStory: (storyOrId: Story|string) => Promise<string>;
	publishArchive: (storyIds?: string[]) => Promise<string>;
	publishStory: (
		storyOrId: Story|string,
		publishOptions?: PublishOptions
	) => Promise<string>;
	publishStoryData: (storyId: string) => string;
}

/**
 * A React hook to publish stories from context. You probably want to use
 * `useStoryLaunch` instead--this is for doing the actual binding of the story
 * and story format.
 */
export function usePublishing(): UsePublishingProps {
	// As little logic as possible should live here--instead it should be in
	// util/publish.ts.

	const {prefs} = usePrefsContext();
	const {dispatch: storyFormatsDispatch, formats} = useStoryFormatsContext();
	const {stories} = useStoriesContext();

	return {
		publishArchive: React.useCallback(
			async () => publishArchive(stories, getAppInfo()),
			[stories]
		),
		proofStory: React.useCallback(
			async storyOrId => {
				const story = typeof storyOrId === 'string' ? storyWithId(stories, storyOrId) : storyOrId;
				const format = formatWithNameAndVersion(
					formats,
					prefs.proofingFormat.name,
					prefs.proofingFormat.version
				);
				const formatProperties = await loadFormatProperties(format)(
					storyFormatsDispatch
				);

				if (!formatProperties) {
					throw new Error(`Couldn't load story format properties`);
				}

				return publishStoryWithFormat(
					story,
					formatProperties.source,
					getAppInfo()
				);
			},
			[
				formats,
				prefs.proofingFormat.name,
				prefs.proofingFormat.version,
				stories,
				storyFormatsDispatch
			]
		),
		publishStory: React.useCallback(
			async (storyOrId, publishOptions) => {
				const story = typeof storyOrId === 'string' ? storyWithId(stories, storyOrId) : storyOrId;
				const format = formatWithNameAndVersion(
					formats,
					story.storyFormat,
					story.storyFormatVersion
				);
				const formatProperties = await loadFormatProperties(format)(
					storyFormatsDispatch
				);

				if (!formatProperties) {
					throw new Error(`Couldn't load story format properties`);
				}

				return publishStoryWithFormat(
					story,
					formatProperties.source,
					getAppInfo(),
					publishOptions
				);
			},
			[formats, stories, storyFormatsDispatch]
		),
		publishStoryData: React.useCallback(
			(storyId: string) => {
				const story = storyWithId(stories, storyId);

				return publishStory(story, getAppInfo(), {startOptional: true});
			},
			[stories]
		)
	};
}
