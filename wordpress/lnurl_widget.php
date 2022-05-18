<?php
/*
Plugin Name: {{package.displayName}} - WebComponent
Plugin URI:  {{package.homepage}}
Description: {{package.description}}
Version:     {{package.version}}
Author:      {{package.author}}
Author URI:  {{package.authorUrl}}
License:     MIT
License URI: https://github.com/podverse/webln-v4v/main/LICENSE.md
*/
function webln_v4v_load(){
	wp_enqueue_script("webln_v4v", plugins_url('webln-v4v', dirname(__FILE__))."/webcomponent.js", array(), false, true);
}

add_action("wp_enqueue_scripts", "webln_v4v_load");
?>