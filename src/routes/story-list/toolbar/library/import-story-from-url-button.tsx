import {IconWorldDownload} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconButton} from '../../../../components/control/icon-button';
import {StoryImportDialog, useDialogsContext} from '../../../../dialogs';

export const ImportStoryFromUrlButton: React.FC = () => {
	const {dispatch} = useDialogsContext();
	const {t} = useTranslation();

	return (
		<IconButton
			icon={<IconWorldDownload />}
			label={t('common.importFromUrl')}
			onClick={() =>
				dispatch({type: 'addDialog', component: StoryImportDialog, props: {fromUrl: true}})
			}
		/>
	);
};
