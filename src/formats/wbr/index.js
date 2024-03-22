import { registerFormatType, insertObject } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const name = 'unitone/wbr';
const title = __( 'wbr', 'unitone' );

const settings = {
	name,
	title,
	tagName: 'span',
	className: 'unitone-wbr',
	contentEditable: false,
	edit: Edit,
};

const DEFAULT_OBJECT_SETTINGS = {
	type: name,
	innerHTML: '<wbr />',
};

function Edit( { value, onChange, onFocus, isObjectActive } ) {
	return (
		<>
			<RichTextToolbarButton
				icon={
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M18.0224 5.25C18.4366 5.25 18.7724 5.58579 18.7724 6V15C18.7724 15.4142 18.4366 15.75 18.0224 15.75L18.0112 15.7499L18 15.75H10.0784V19L4.5 14.8349L10.0784 10.6699V14.25H17.2724V6C17.2724 5.58579 17.6082 5.25 18.0224 5.25Z"
							fill="currentColor"
						/>
					</svg>
				}
				title={ title }
				onClick={ () => {
					const newValue = insertObject(
						value,
						{
							...DEFAULT_OBJECT_SETTINGS,
						},
						value.end,
						value.end
					);
					newValue.start = newValue.end - 1;
					onChange( newValue );

					onFocus();
				} }
				isActive={ isObjectActive }
			/>
		</>
	);
}

registerFormatType( settings.name, settings );
