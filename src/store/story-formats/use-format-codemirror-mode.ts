import {version as twineVersion} from '../../../package.json';
import CodeMirror from 'codemirror';
import * as React from 'react';
import {
	formatWithNameAndVersion,
	loadFormatProperties,
	useStoryFormatsContext
} from '.';
import {
	formatEditorExtensions,
	namespaceForFormat
} from '../../util/story-format';

/**
 * Sets up a CodeMirror mode for a format, if the format has defined one via
 * properties.codeMirror.mode. Once one is fully set up, this returns the name
 * of that mode. If the mode is being set up or the format hasn't defined one,
 * this returns undefined.
 */
export function useFormatCodeMirrorMode(
	formatName: string,
	formatVersion: string
) {
	const {dispatch, formats} = useStoryFormatsContext();
	const format = formatWithNameAndVersion(formats, formatName, formatVersion);
	const [modeName, setModeName] = React.useState<string>();

	React.useEffect(() => {
		if (format.loadState === 'unloaded') {
			dispatch(loadFormatProperties(format));
		} else if (format.loadState === 'loaded') {
			const editorExtensions = formatEditorExtensions(format, twineVersion);

			if (editorExtensions?.codeMirror?.mode) {
				CodeMirror.defineMode(
					namespaceForFormat(format),
					editorExtensions.codeMirror.mode
				);
				setModeName(namespaceForFormat(format));
			}
		}
	}, [dispatch, format]);

	return modeName;
}
