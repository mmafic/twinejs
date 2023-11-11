import {IconFileArrowRight} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconButton} from '../../../components/control/icon-button';
import {StoryImportDialog, useDialogsContext} from '../../../dialogs';
import {Story} from '../../../store/stories';

export interface SaveToLibraryButtonProps {
	story: Story;
}

export const SaveToLibraryButton: React.FC<SaveToLibraryButtonProps> = props => {
	const {story} = props;
	const {dispatch} = useDialogsContext();
	const {t} = useTranslation();

	const [saved, setSaved] = React.useState(false);

	function handleCloseDialog(value: boolean | Event) {
		if (value === true) {
			setSaved(true);
		}
	}

	return (
		<IconButton
			icon={<IconFileArrowRight />}
			label={saved ? t('routes.storyEdit.toolbar.savedToLibrary') : t('routes.storyEdit.toolbar.saveToLibrary')}
			disabled={saved}
			onClick={() =>
				dispatch({
					type: 'addDialog',
					component: StoryImportDialog,
					props: {providedStories: [{ ...story, preview: false }], onClose: handleCloseDialog}
				})
			}
		/>
	);
};
