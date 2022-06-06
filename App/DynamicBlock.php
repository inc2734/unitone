<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Unitone\App;

class DynamicBlock {

	/**
	 * Render template.
	 *
	 * @param string $slug Slug of the block view.
	 * @param array  $attributes This variable can be referenced in the template.
	 * @param string $content Inner content.
	 * @return string
	 */
	public static function render(
		$path,
		// phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$attributes,
		$content = null
		// phpcs:enable
	) {
		ob_start();
		include( $path . '/view.php' );
		return ob_get_clean();
	}
}
