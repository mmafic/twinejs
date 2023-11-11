import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {CardContent} from '../../components/container/card';
import {
	DialogCard,
	DialogCardProps
} from '../../components/container/dialog-card';
import {storyFileName} from '../../electron/shared';
import {importStories, Story, useStoriesContext} from '../../store/stories';
import {useStoriesRepair} from '../../store/use-stories-repair';
import {FileChooser} from './file-chooser';
import {StoryChooser} from './story-chooser';
import {UrlInput} from './url-input';
import './story-import.css';

export interface StoryImportDialogProps extends Omit<DialogCardProps, 'headerLabel'> {
	fromUrl?: boolean;
	providedStories?: Story[];
};

export const StoryImportDialog: React.FC<StoryImportDialogProps> = props => {
	const {onClose, fromUrl, providedStories} = props;
	const {t} = useTranslation();
	const repairStories = useStoriesRepair();
	const {dispatch, stories: existingStories} = useStoriesContext();
	const [loaded, setLoaded] = React.useState(false);
	const [stories, setStories] = React.useState<Story[]>([]);

	function handleImport(stories: Story[]) {
		dispatch(importStories(stories, existingStories));
		repairStories();
		onClose(true);
	}

	function handleStories(stories: Story[]) {
		// If there are no conflicts in the stories, import them now. Otherwise, set
		// them in state and let the user choose via <StoryChooser>.

		if (
			stories.length === 0 ||
			stories.some(story =>
				existingStories.some(
					existing => !existing.preview && storyFileName(existing) === storyFileName(story)
				)
			)
		) {
			setLoaded(true);
			setStories(stories);
		} else {
			handleImport(stories);
		}
	}

	React.useEffect(() => {
		if (!providedStories) return;
		handleStories(providedStories);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<DialogCard
			{...props}
			className="story-import-dialog"
			fixedSize
			headerLabel={t('dialogs.storyImport.title')}
		>
			<CardContent>
				{!providedStories && (
					fromUrl
						? <>
								<span>{t('dialogs.storyImport.urlDisclaimer')}</span>
								<UrlInput onDownload={handleStories} />
							</>
						: <FileChooser onChange={handleStories} />
				)}
				{stories.length > 0 && (
					<StoryChooser
						existingStories={existingStories}
						onImport={handleImport}
						stories={stories}
					/>
				)}
				{loaded && stories.length === 0 && (
					<p>{t('dialogs.storyImport.noStoriesInFile')}</p>
				)}
			</CardContent>
		</DialogCard>
	);
};
