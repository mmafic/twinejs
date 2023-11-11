import * as React from 'react';
import {MainContent} from '../../components/container/main-content';
import {Story} from '../../store/stories';
import {MarqueeablePassageMap} from './marqueeable-passage-map';
import {PassageFuzzyFinder} from './passage-fuzzy-finder';
import {StoryEditToolbar} from './toolbar';
import {useInitialPassageCreation} from './use-initial-passage-creation';
import {usePassageChangeHandlers} from './use-passage-change-handlers';
import {useViewCenter} from './use-view-center';
import {useZoomShortcuts} from './use-zoom-shortcuts';
import {useZoomTransition} from './use-zoom-transition';
import './story-edit-route.css';

export interface StoryEditorProps {
	story: Story;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({ story }) => {
	const [fuzzyFinderOpen, setFuzzyFinderOpen] = React.useState(false);
	const mainContent = React.useRef<HTMLDivElement>(null);
	const {getCenter, setCenter} = useViewCenter(story, mainContent);
	const {
		handleDeselectPassage,
		handleDragPassages,
		handleEditPassage,
		handleSelectPassage,
		handleSelectRect
	} = usePassageChangeHandlers(story);
	const visibleZoom = useZoomTransition(story.zoom, mainContent.current);
	useZoomShortcuts(story);
	useInitialPassageCreation(story, getCenter);

	return (
		<>
			<StoryEditToolbar
				getCenter={getCenter}
				onOpenFuzzyFinder={() => setFuzzyFinderOpen(true)}
				story={story}
			/>
			<MainContent grabbable padded={false} ref={mainContent}>
				<MarqueeablePassageMap
					container={mainContent}
					formatName={story.storyFormat}
					formatVersion={story.storyFormatVersion}
					onDeselect={handleDeselectPassage}
					onDrag={handleDragPassages}
					onEdit={handleEditPassage}
					onSelect={handleSelectPassage}
					onSelectRect={handleSelectRect}
					passages={story.passages}
					preview={story.preview}
					startPassageId={story.startPassage}
					tagColors={story.tagColors}
					visibleZoom={visibleZoom}
					zoom={story.zoom}
				/>
				<PassageFuzzyFinder
					onClose={() => setFuzzyFinderOpen(false)}
					onOpen={() => setFuzzyFinderOpen(true)}
					open={fuzzyFinderOpen}
					setCenter={setCenter}
					story={story}
				/>
			</MainContent>
		</>
	);
};
