import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {IconIndentDecrease, IconIndentIncrease} from '@tabler/icons';
import {IconButton} from '../control/icon-button';

export interface IndentButtonsProps {
	/**
	 * Disables both buttons no matter the state of the editor.
	 */
	disabled?: boolean;
	/**
	 * CodeMirror instance to interact with.
	 */
	editor?: CodeMirror.Editor;
}

export const IndentButtons: React.FC<IndentButtonsProps> = props => {
	const {disabled, editor} = props;
	const {t} = useTranslation();

	function execCommand(command: string) {
		editor?.execCommand(command);
		editor?.focus();
	}

	return (
		<>
			<IconButton
				disabled={disabled || !editor}
				icon={<IconIndentIncrease />}
				label={t('components.indentButtons.indent')}
				onClick={() => execCommand('indentMore')}
			/>
			<IconButton
				disabled={disabled || !editor}
				icon={<IconIndentDecrease />}
				label={t('components.indentButtons.unindent')}
				onClick={() => execCommand('indentLess')}
			/>
		</>
	);
};
