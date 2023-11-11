import {IconEyeglass2} from '@tabler/icons';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconButton, IconButtonProps} from '../../components/control/icon-button';

export type PreviewUrlButtonProps = Omit<IconButtonProps, 'icon'|'label'>;

export const PreviewUrlButton: React.FC<PreviewUrlButtonProps> = props => {
	const {t} = useTranslation();

	return (
		<IconButton
			icon={<IconEyeglass2 />}
			label={t('common.preview')}
			{...props}
		/>
	);
};
