import * as React from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useQuery} from '../../util/use-query';
import {replaceDom} from '../../util/replace-dom';
import {usePublishing} from '../../store/use-publishing';
import {ErrorMessage} from '../../components/error';
import {showDisclaimer, storiesFromUrl} from '../../util/preview';

export const StoryProofRoute: React.FC = () => {
	const [publishError, setPublishError] = React.useState<Error>();
	const [inited, setInited] = React.useState(false);
	const {storyId} = useParams<{storyId: string}>();
	const query = useQuery();
	const storyUrl = query.get('url');
	const {proofStory} = usePublishing();
	const {t} = useTranslation();

	React.useEffect(() => {
		async function load() {
			try {
				if (storyUrl) {
					if (!showDisclaimer(t, storyUrl)) return;
					await storiesFromUrl(storyUrl, true)
						.then(([parsedStory]) => proofStory(parsedStory))
						.then((publishedStory) => replaceDom(publishedStory));
				} else {
					replaceDom(await proofStory(storyId));
				}
			} catch (error) {
				setPublishError(error as Error);
			}
		}

		if (!inited) {
			setInited(true);
			load();
		}
	}, [inited, proofStory, storyId, storyUrl, t]);

	if (publishError) {
		return <ErrorMessage>{publishError.message}</ErrorMessage>;
	}

	return null;
};
