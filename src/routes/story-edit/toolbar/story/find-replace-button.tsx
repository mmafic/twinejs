import {IconSearch} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconButton} from '../../../../components/control/icon-button';
import {StorySearchDialog, useDialogsContext} from '../../../../dialogs';
import {Story} from '../../../../store/stories';

export interface FindReplaceButtonProps {
	story: Story;
	disableReplace?: boolean;
}

export const FindReplaceButton: React.FC<FindReplaceButtonProps> = props => {
	const {story, disableReplace} = props;
	const {dispatch} = useDialogsContext();
	const {t} = useTranslation();

	return (
		<IconButton
			icon={<IconSearch />}
			label={disableReplace ? t('routes.storyEdit.toolbar.find') : t('routes.storyEdit.toolbar.findAndReplace')}
			onClick={() =>
				dispatch({
					type: 'addDialog',
					component: StorySearchDialog,
					props: {
						find: '',
						flags: {
							includePassageNames: true,
							matchCase: false,
							useRegexes: false
						},
						replace: '',
						storyId: story.id,
						disableReplace,
					}
				})
			}
		/>
	);
};
