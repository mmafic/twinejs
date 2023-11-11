import * as React from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {DocumentTitle} from '../../components/document-title/document-title';
import {DialogsContextProvider} from '../../dialogs';
import {storyWithId, useStoriesContext, importStories} from '../../store/stories';
import {
	UndoableStoriesContextProvider,
	useUndoableStoriesContext
} from '../../store/undoable-stories';
import { useStoriesRepair } from '../../store/use-stories-repair';
import { showDisclaimer, storiesFromUrl } from '../../util/preview';
import { useQuery } from '../../util/use-query';
import './story-edit-route.css';
import { StoryEditor } from './story-editor';

export const InnerStoryEditRoute: React.FC = () => {
	const params = useParams<{storyId: string}>();
	const query = useQuery();
	const {stories: undoableStories} = useUndoableStoriesContext();
	const {stories, dispatch} = useStoriesContext();
	const repairStories = useStoriesRepair();
	const {t} = useTranslation();

	const [storyId, setStoryId] = React.useState(params.storyId);
	const story = storyId ? storyWithId(undoableStories, storyId) : null;

	React.useEffect(() => {
		if (params.storyId || story) return;
		const url = query.get('url');
		if (url) {
			// TODO: error message for CORS issues
			// TODO: error message for other request failures
			// TODO: error message for parsing the file
			if (!showDisclaimer(t, url)) return;
			storiesFromUrl(url, true)
				.then(([parsedStory]) => {
					dispatch(importStories([parsedStory], stories));
					repairStories();
					setStoryId(parsedStory.id);
				});
		}
	}, [params, story, query, stories, dispatch, repairStories, undoableStories, t]);

	return (
		<div className="story-edit-route">
			<DocumentTitle title={story?.name ?? 'Loading Story...'} />
			{story && <StoryEditor story={story} />}
		</div>
	);
};

// This is a separate component so that the inner one can use
// `useDialogsContext()` and `useUndoableStoriesContext()` inside it.

export const StoryEditRoute: React.FC = () => (
	<UndoableStoriesContextProvider>
		<DialogsContextProvider>
			<InnerStoryEditRoute />
		</DialogsContextProvider>
	</UndoableStoriesContextProvider>
);
