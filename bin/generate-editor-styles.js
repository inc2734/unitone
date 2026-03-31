const fs = require( 'fs' );
const path = require( 'path' );

const appCssDir = path.resolve( __dirname, '../dist/css/app' );
const tmpCssPath = path.join( appCssDir, 'editor-styles.tmp.css' );
const editorStylePath = path.join( appCssDir, 'editor-style.css' );

const sourceCss = fs.readFileSync( tmpCssPath, 'utf8' );

const replacements = [
	{
		search: [ ':where(body)' ],
		replace: ':where(.editor-styles-wrapper)',
	},
	{
		search: [
			'div:where(.editor-styles-wrapper.block-editor-writing-flow) html',
			'div:where(.editor-styles-wrapper.block-editor-writing-flow) body',
		],
		replace: 'div:where(.editor-styles-wrapper.block-editor-writing-flow)',
	},
	{
		search: [
			':where(.editor-styles-wrapper.block-editor-iframe__body) html',
			':where(.editor-styles-wrapper.block-editor-iframe__body) body',
		],
		replace: ':where(.editor-styles-wrapper.block-editor-iframe__body)',
	},
	{
		search: [ '}:where(.editor-styles-wrapper)' ],
		replace: '}html :where(.editor-styles-wrapper)',
	},
	{
		search: [
			':where(.editor-styles-wrapper.block-editor-iframe__body) :root',
			'div:where(.editor-styles-wrapper.block-editor-writing-flow) :root',
		],
		replace: ':root',
	},
];

const editorStyleCss = replacements.reduce( ( css, { search, replace } ) => {
	return search.reduce( ( currentCss, searchValue ) => {
		return currentCss.split( searchValue ).join( replace );
	}, css );
}, sourceCss );

fs.writeFileSync( editorStylePath, editorStyleCss );
fs.rmSync( tmpCssPath );
