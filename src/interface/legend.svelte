<script>
  import { css_multiply } from './css_manipulate.js';

  export let image_dir = "";
  export let image = null;
  export let colors;
  export let labels = colors.map(() => null);
  export let labels_below = colors.map(() => null);
  export let item_height;
  export let item_width;
  export let show_residual;
  export let selected_channel = null;
  export let enable_hover;
  export let show_residual_legend_item;
</script>

<style>
 .container {
   position: absolute;
   overflow: hidden;
   height: 62.5%;
   width: 100%;
   top: 0%;
   left: 0%;
   border: 1px solid gray;
 }

 .container-below {
   position: absolute;
   height: 56.25%;
   width: 71.66%;
   top: 68.75%;
   left: 32.5%;
   font-size: 0.75em;
   line-height: 1.5em;
 }

 .image {
   position: relative;
   background-size: 100% 100%;
   image-rendering: pixelated;
 }

 .label {
   font-weight: bold;
   color: white;
 }
</style>

{#each colors as color, index}
  <div style="display: inline-block;
              padding: 0.5em;
              background: {selected_channel === index ? 'whitesmoke' : 'white'};
              border: 1px solid {selected_channel === index ? 'gray' : 'white'}; 
              border-radius: 0.25em;
              cursor: pointer;
              overflow: hidden;"
       on:mouseover={() => {if (enable_hover) {selected_channel = index;}}}
       on:mouseout={() => {if (enable_hover) {selected_channel = null;}}}
  >
    <div
      style="position: relative;
             height: {css_multiply(item_height, 1.6)};
             width: {item_width};
             white-space: nowrap;"
    >
      <div
        class="center-text"
        style="position: absolute;
               top: 68.75%;
               left: 0%;
               height: 15.625%;
               width: 25%;
               background-color: {color};
               border-radius: 20%;
               color: white;
               font-weight: bold;"
      ><!-- {index + 1} --></div>
      {#if image !== null}
        <div class="container striped" style="z-index: 0;">
          <div
            class="image opaque-hover"
            style="background-image: url('{image_dir + image}');
                   height: 100%;
                   width: {colors.length * 100}%;
                   left: {- index * 100}%;"
          ></div>
        </div>
      {/if}
      {#if labels[index] !== null}
        <div class="container label center-text" style="z-index: 1;">{labels[index]}</div>
      {/if}
      {#if labels_below[index] !== null}
        <div class="container-below" style="font-style: italic; z-index: 1; text-align: left;">{@html labels_below[index]}</div>
      {/if}
    </div>
  </div>
{/each}

{#if show_residual_legend_item}
  <div style="display: inline-block;
              padding: 0.5em;
              background: {selected_channel === 'res' ? 'whitesmoke' : 'white'};
              border: 1px solid {selected_channel === 'res' ? 'gray' : 'white'}; 
              border-radius: 0.25em;
              cursor: pointer;
              overflow: hidden;"
       on:mouseover={() => {if (enable_hover) {selected_channel = "res";}}}
       on:mouseout={() => {if (enable_hover) {selected_channel = null;}}}
  >
    <div
      style="position: relative;
             height: {css_multiply(item_height, 1.6)};
             width: {item_width};
             white-space: nowrap;"
    >
      <div
        class="center-text"
        style="position: absolute;
               top: 68.75%;
               left: 0%;
               height: 15.625%;
               width: 35%;
               font-size: 0.5em;
               line-height: 1.1em;
               font-weight: bold;
               color: gray;
               background-color: white;
               border: 1px {(show_residual || selected_channel == 'res') ? 'solid': 'dashed'} gray;
               border-radius: 20%;"
      >
        {#if !(show_residual || selected_channel == 'res')}
          <span>hover<br>to show</span>
        {/if}
      </div>
      <div class="container center-text" style="font-style: italic; z-index: 1; background: white;">
        residual
      </div>
      <div class="container-below" style="font-style: italic; z-index: 1; left: 35%;">
        Everything<br>else
      </div>
    </div>
  </div>
{/if}
