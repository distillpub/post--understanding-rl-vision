<script>
  export let state;
  export let speed = 25;
  export let width;
  export let max_duration;
  export let max_speed = 99;
  export let last_direction = 1;
  export let navigator_div;
  export let simple = false;
  export let loop = true;

  const clip_position = function(position) {
    if (loop) {
      position = (position + max_duration + 0.5) % max_duration - 0.5;
    }
    return Math.max(0, Math.min(max_duration - 1, position));
  };
  /* const clip_speed = function(speed) {
   *   return Math.max(0, Math.min(max_speed, speed));
   * }; */

  const update_position = function() {
    let speed_safe = speed;
    if (typeof(speed_safe) !== "number") {
      speed_safe = 0;
    }
    let delta = state.velocity_direction * Math.sign(speed_safe);
    state.position = Math.round(clip_position(state.position + delta));
    let seconds = 1;
    if (speed_safe !== 0) {
      seconds = 1 / Math.abs(speed_safe);
    }
    window.setTimeout(update_position, 1000 * seconds);
  };
  update_position();

  const handle_keydown = function(event) {
    if (event.keyCode === 37 || event.keyCode === 39) {
      let delta = event.keyCode === 37 ? -1 : 1;
      if (state.velocity_direction === 0) {
        state.position = clip_position(state.position + delta);
      }
      else {
        state.velocity_direction = delta;
      }
      last_direction = delta;
      event.preventDefault();
    }
    /* else if (event.keyCode === 38 || event.keyCode === 40) {
     *   speed = clip_speed(speed + (event.keyCode == 38 ? 1 : -1));
     *   event.preventDefault();
     * } */
    else if (event.keyCode === 32) {
      if (state.velocity_direction === 0) {
        state.velocity_direction = last_direction;
      }
      else {
        state.velocity_direction = 0;
      }
      event.preventDefault();
    }
  };
</script>

<style>
 .container {
   display: inline-block;
   position: absolute;
   padding: 0em 0.25em;
 }

 button {
   cursor: pointer;
 }

 .hotkey {
   font-size: 0.75em;
   color: gray;
   padding: 0.1em 0.5em;
   border: 1px solid gray;
   border-radius: 0.25em;
   cursor: default;
 }
</style>

{#if simple}
  <div style="position: relative;
              width: {width};
              margin: 0.5em auto;
              padding: 0.25em 0em;
              text-align: center;"
       bind:this={navigator_div}
  >

    <div class="container" style="top: 1.5em; left: 0%; text-align: left; z-index: 1;">
      <button
        on:click={() => {state.velocity_direction = 0; state.position = clip_position(state.position - 1); last_direction = -1;}}
        style="font-size: 1em; font-weight: bold;"
      >&#8592;</button>
    </div>
    <div class="container" style="left: 0%; right: 0%; text-align: center; z-index: 0;">
      <button
        on:click={() => {state.velocity_direction = state.velocity_direction === 1 ? 0 : 1; last_direction = state.velocity_direction;}}
        style="height: 1.3em; width: 1.3em; font-size: 3em;"
      >
        <span>{#if state.velocity_direction === 1}<span>&#10074;&#10074;</span>{:else}<span>&#9658;</span>{/if}</span>
      </button>
      <br>
      <span style="font-size: 0.7em; color: gray;">Speed:&emsp;<input bind:value={speed} type="number" min="{-max_speed}" max="{max_speed}" size="4">&ensp;FPS</span>
    </div>
    <div class="container" style="top: 1.5em; right: 0%; text-align: right; z-index: 1;">
      <button
        on:click={() => {state.velocity_direction = 0; state.position = clip_position(state.position + 1); last_direction = 1;}}
        style="font-size: 1em; font-weight: bold;"
      >&#8594;</button>
      <br>
    </div>
  </div>
{:else}
  <div style="position: relative;
              width: {width};
              margin: 0.5em auto;
              padding: 0.25em 0em;
              border: 1px solid gray;"
       tabindex="0"
       on:keydown={handle_keydown}
       bind:this={navigator_div}
  >
    <div class="container" style="left: 0%; text-align: left; z-index: 1;">
      <button
        on:click={() => {state.velocity_direction = 0; state.position = clip_position(state.position - 1); last_direction = -1;}}
      >&#8592;</button>
      <button
        on:click={() => {state.velocity_direction = 0; state.position = clip_position(state.position + 1); last_direction = 1;}}
      >&#8594;</button>
    </div>
    <div class="container" style="left: 0%; right: 0%; text-align: center; z-index: 0;">
      <button on:click={() => state.position = 0}>&#10074;&#9664;</button>
      <button on:click={() => {state.velocity_direction = state.velocity_direction === -1 ? 0 : -1; last_direction = state.velocity_direction;}}>
        {#if state.velocity_direction === -1}<span>&#10074;&#10074;</span>{:else}<span>&#9664;</span>{/if}
      </button>
      <button on:click={() => {state.velocity_direction = state.velocity_direction === 1 ? 0 : 1; last_direction = state.velocity_direction;}}>
        {#if state.velocity_direction === 1}<span>&#10074;&#10074;</span>{:else}<span>&#9658;</span>{/if}
      </button>
      <button on:click={() => state.position = max_duration - 1}>&#9658;&#10074;</button>
      <br>
      <span class="hotkey">&#8592;</span>
      <span class="hotkey">space</span>
      <span class="hotkey">&#8594;</span>
    </div>
    <div class="container" style="right: 0%; text-align: right; z-index: 1;">
      <input bind:value={speed} type="number" min="0" max="{max_speed}"> fps
      <br>
      <label><input type="checkbox" bind:checked={loop}> loop</label>
    </div>
    <div style="visibility: hidden;"><button>&nbsp;</button><br><span class="hotkey">&nbsp;</span></div>
  </div>
{/if}
