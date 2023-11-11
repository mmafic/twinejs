import * as React from 'react';
import {ButtonBar} from '../../../../components/container/button-bar';
import {ArchiveButton} from './archive-button';
import {ImportStoryFromFileButton} from './import-story-from-file-button';
import {ImportStoryFromUrlButton} from './import-story-from-url-button';
import {StoryTagsButton} from './story-tags-button';

export const LibraryActions: React.FC = () => (
	<ButtonBar>
		<StoryTagsButton />
		<ImportStoryFromFileButton />
		<ImportStoryFromUrlButton />
		<ArchiveButton />
	</ButtonBar>
);
