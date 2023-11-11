import * as React from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useQuery} from '../../util/use-query';
import {replaceDom} from '../../util/replace-dom';
import {usePublishing} from '../../store/use-publishing';
import {ErrorMessage} from '../../components/error';
import {showDisclaimer, storiesFromUrl} from '../../util/preview';

export const StoryTestRoute: React.FC = () => {
	const [publishError, setPublishError] = React.useState<Error>();
	const [inited, setInited] = React.useState(false);
	const {passageId, storyId} = useParams<{
		passageId: string;
		storyId: string;
	}>();
	const query = useQuery();
	const storyUrl = query.get('url');
	const {publishStory} = usePublishing();
	const {t} = useTranslation();

	React.useEffect(() => {
		async function load() {
			try {
				if (storyUrl) {
					if (!showDisclaimer(t, storyUrl)) return;
					await storiesFromUrl(storyUrl, true)
						.then(([parsedStory]) => publishStory(parsedStory, { formatOptions: 'debug' }))
						.then((publishedStory) => replaceDom(publishedStory));
				} else {
					replaceDom(
						await publishStory(storyId, {
							formatOptions: 'debug',
							startId: passageId
						})
					);
				}
			} catch (error) {
				setPublishError(error as Error);
			}
		}

		if (!inited) {
			setInited(true);
			load();
		}
	}, [inited, passageId, publishStory, storyId, storyUrl, t]);

	if (publishError) {
		return <ErrorMessage>{publishError.message}</ErrorMessage>;
	}

	return null;
};
