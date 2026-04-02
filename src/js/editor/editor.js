import './hooks/embed';
import './hooks/style';

import './wp-blocks/button';
import './wp-blocks/image';
import './wp-blocks/navigation';
import './wp-blocks/post-template';
import './wp-blocks/query';
import './wp-blocks/table';
import './wp-blocks/post-terms';
import './wp-blocks/tag-cloud';

import './plugins/block-outline-toolbar/index';
import './plugins/content-only-locking/index';
import './plugins/highlight-selected-block/index';
import './plugins/lineage-toolbar/index';
import './plugins/remote-pattern/index';
import './plugins/sync-children/index';
import './plugins/paste-styles/index';
import './plugins/override-settings/index';

const loadWhenIdle = ( loader, timeout = 2000 ) => {
	const requestIdleCallback = window.requestIdleCallback?.bind( window );

	if ( requestIdleCallback ) {
		requestIdleCallback(
			() => {
				void loader();
			},
			{ timeout }
		);
		return;
	}

	setTimeout( () => {
		void loader();
	}, 1 );
};

loadWhenIdle( () => import( './plugins/featured-image-generator/index' ) );
loadWhenIdle( () => import( './plugins/ogp/index' ) );
loadWhenIdle( () => import( './plugins/text-generator/index' ) );
loadWhenIdle( () => import( './plugins/wireframe-generator/index' ) );
