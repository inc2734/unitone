import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

const withProviderClassName = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( 'core/embed' !== props.name ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<BlockListBlock
					{ ...props }
					className={ `wp-block-embed-${ props.block.attributes.providerNameSlug }` }
				/>
			);
		};
	},
	'withProviderClassName'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/embed/classnames',
	withProviderClassName
);
