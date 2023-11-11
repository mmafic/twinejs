import {IconDownload} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconButton, IconButtonProps} from '../../components/control/icon-button';

export type DownloadUrlButtonProps = Omit<IconButtonProps, 'icon'|'label'>;

export const DownloadUrlButton: React.FC<DownloadUrlButtonProps> = props => {
	const {t} = useTranslation();

	return (
		<IconButton
			icon={<IconDownload />}
			label={t('common.download')}
			{...props}
		/>
	);
};
