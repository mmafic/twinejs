import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from '../../components/control/text-input';
import {Story} from '../../store/stories';
import { preventDisclaimer, storiesFromUrl } from '../../util/preview';
import { DownloadUrlButton } from './download-url-button';
import { PreviewUrlButton } from './preview-url-button';

export interface UrlInputProps {
	onDownload: (stories: Story[]) => void;
}

function stringToUrl(s: string) {
	try {
		return new URL(s);
	} catch (err) {
		return null;
	}
}

export const UrlInput: React.FC<UrlInputProps> = props => {
	const {onDownload} = props;
	const {t} = useTranslation();

	const [inputValue, setInputValue] = React.useState('');

	const url = stringToUrl(inputValue);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		setInputValue(event.target.value);
	}

	function handleDownload() {
		if (!url) return;
		storiesFromUrl(url).then(onDownload);
	}

	function handlePreview() {
		if (!url) return;
		preventDisclaimer(url);
		window.location.assign(`/#/preview?url=${url!.toString()}`)
	}

	return (
		<div className="file-chooser">
			<p>
				<TextInput value={inputValue} onChange={handleChange}>
					{t('dialogs.storyImport.enterUrl')}
				</TextInput>
				<PreviewUrlButton disabled={!url} onClick={handlePreview} />
				<DownloadUrlButton disabled={!url} onClick={handleDownload} />
			</p>
		</div>
	);
};
