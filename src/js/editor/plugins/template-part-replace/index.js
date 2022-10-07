import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { TemplatePartReplaceToolbar } from './template-part-replace-toolbar';

const withReplace = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<>
				<BlockEdit { ...props } />

				{ 'core/template-part' === props.name && (
					<TemplatePartReplaceToolbar { ...props } />
				) }
			</>
		);
	};
}, 'withReplace' );

addFilter( 'editor.BlockEdit', 'unitone/template-part/replace', withReplace );
