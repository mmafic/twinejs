import * as React from 'react';
import {fakeStory} from '../../../test-util';
import {FileChooserProps} from '../file-chooser';

const mockStory = fakeStory();

mockStory.name = 'mock-story';

export const FileChooser: React.FC<FileChooserProps> = ({onChange}) => (
	<div data-testid="mock-file-chooser">
		<button onClick={() => onChange([mockStory])}>onChange</button>
		<button onClick={() => onChange([])}>onChange no story</button>
	</div>
);
