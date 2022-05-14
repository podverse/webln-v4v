<?php
/*
Plugin Name: {{package.displayName}} - WebComponent
Plugin URI:  {{package.homepage}}
Description: {{package.description}}
Version:     {{package.version}}
Author:      {{package.author}}
Author URI:  {{package.authorUrl}}
License:     MIT
License URI: https://github.com/podverse/lnurl-widget/main/LICENSE.md
*/
function lnurl_widget_load(){
	wp_enqueue_script("lnurl_widget", plugins_url('lnurl-widget', dirname(__FILE__))."/webcomponent.js", array(), false, true);
}

add_action("wp_enqueue_scripts", "lnurl_widget_load");
?>