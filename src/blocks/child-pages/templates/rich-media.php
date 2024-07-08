<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

$data_unitone_layout = array(
	'responsive-grid',
);
if ( ! empty( $attributes['unitone']['gap'] ) ) {
	$data_unitone_layout[] = '-gap:' . $attributes['unitone']['gap'];
}

$style = array();
if ( ! empty( $attributes['columnMinWidth'] ) ) {
	$style[] = '--unitone--column-min-width: ' . $attributes['columnMinWidth'];
}
?>
<div
	data-unitone-layout="<?php echo esc_attr( implode( ' ', $data_unitone_layout ) ); ?>"
	style="<?php echo esc_attr( implode( ' ', $style ) ); ?>"
>
	<?php while ( $the_query->have_posts() ) : ?>
		<?php
		$the_query->the_post();

		$item_class = array( 'unitone-child-pages__item' );
		$item_style = array();

		if ( $background_color || $style_background_color ) {
			$item_class[] = 'has-background';
		}

		if ( $background_color ) {
			$item_class[] = 'has-' . $background_color . '-background-color';
		}

		if ( $style_background_color ) {
			$item_style[] = 'background-color: ' . $style_background_color;
		}

		$item_inner_class   = array( 'stack' );
		$item_inner_class[] = $background_color || $style_background_color ? '-gap:0' : '-gap:-1';

		$item_content_class   = array( 'decorator' );
		$item_content_class[] = $background_color || $style_background_color ? '-padding:1' : '-padding:0';
		?>
		<div
			data-unitone-layout="decorator"
			class="<?php echo esc_attr( implode( ' ', $item_class ) ); ?>"
			style="<?php echo esc_attr( implode( ';', $item_style ) ); ?>"
		>
			<div data-unitone-layout="decorator__inner" style="height: 100%">
				<div data-unitone-layout="cover -gap:-2 -padding:0" style="--unitone--min-height: 100%">
					<div data-unitone-layout="cover__content -valign:top">
						<div data-unitone-layout="<?php echo esc_attr( implode( ' ', $item_inner_class ) ); ?>">
							<div data-unitone-layout="frame">
								<figure class="wp-block-post-featured-image">
									<?php the_post_thumbnail(); ?>
								</figure>
							</div>

							<div data-unitone-layout="<?php echo esc_attr( implode( ' ', $item_content_class ) ); ?>">
								<div data-unitone-layout="stack -gap:-2">
									<p><strong><?php the_title(); ?></strong></p>

									<?php if ( ! empty( get_post()->post_excerpt ) ) : ?>
										<p class="has-unitone-xs-font-size"><?php echo wp_kses_post( get_post()->post_excerpt ); ?></p>
									<?php endif; ?>
								</div>
							</div>
						</div>
					</div>
					<div data-unitone-layout="cover__content -valign:bottom">
						<div data-unitone-layout="<?php echo esc_attr( implode( ' ', $item_content_class ) ); ?>">
							<p class="has-unitone-xs-font-size has-text-align-right">
								<a aria-hidden="true"><?php esc_html_e( 'Learn more', 'unitone' ); ?></a>
							</p>
						</div>
					</div>
				</div>
				<a data-unitone-layout="decorator__link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Learn more', 'unitone' ); ?></a>
			</div>
		</div>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</div>
