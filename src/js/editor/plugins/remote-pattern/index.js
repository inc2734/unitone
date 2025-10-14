import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

const fileExist = async function ( url ) {
	try {
		const response = await fetch( url );
		return 200 === response.status;
	} catch ( error ) {
		console.error( error ); // eslint-disable-line no-console
	}
	return false;
};

const replaceUnitonePatternImages = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const {
				name,
				canMove,
				canRemove,
				isSelectionEnabled,
				isSelected,
				block,
				attributes,
			} = props;

			const maybePreview =
				! canMove &&
				! canRemove &&
				! isSelectionEnabled &&
				! isSelected;

			if ( 'core/image' !== name ) {
				return <BlockListBlock { ...props } />;
			}

			if ( maybePreview ) {
				return <BlockListBlock { ...props } />;
			}

			const fileUrl = attributes.url;

			const regExpTheme = new RegExp(
				'https://unitone.2inc.org/wp-content/themes/unitone'
			);

			const regExpUnitone = new RegExp( 'https://unitone.2inc.org' );

			if ( window.unitoneSettings.url.match( regExpTheme ) ) {
				return <BlockListBlock { ...props } />;
			}

			const isFileInTheme = fileUrl?.match( regExpTheme );
			const isFileInUnitone = fileUrl?.match( regExpUnitone );

			if ( ! isFileInTheme && ! isFileInUnitone ) {
				return <BlockListBlock { ...props } />;
			}

			if ( isFileInUnitone && ! isFileInTheme ) {
				attributes.url = `${ window.unitoneSettings.url }/dist/img/dummy.jpg`;
				block.attributes.url = attributes.url;

				return (
					<BlockListBlock { ...{ ...props, block, attributes } } />
				);
			}

			if ( isFileInTheme ) {
				const newFileUrl = fileUrl.replace(
					regExpTheme,
					window.unitoneSettings.url
				);
				fileExist( newFileUrl ).then( ( isExist ) => {
					if ( isExist ) {
						attributes.url = newFileUrl;
						block.attributes.url = attributes.url;
					}

					return (
						<BlockListBlock
							{ ...{ ...props, block, attributes } }
						/>
					);
				} );
			}

			return <BlockListBlock { ...props } />;
		};
	},
	'replaceUnitonePatternImages'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/replace-unitone-pattern-images',
	replaceUnitonePatternImages
);
