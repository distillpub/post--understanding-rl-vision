<script>
  export let actions = null;
  export let rewards = null;
  export let dones = null;
  export let policy_logits = null;
  export let state;
  export let action_htmls = null;
  export let action_colors = null;
  export let bold_color = null;
  export let policy_display_height;
  export let policy_display_width;
  export let action_permutation;
  export let attribution_kinds;
  export let show_attribution_selector;

  $: policy_probs_permuted = (function() {
    let probs = policy_logits[state.position].map(Math.exp);
    let sum_probs = probs.reduce((total, prob) => total + prob, 0);
    probs = probs.map(prob => prob / sum_probs);
    let probs_permuted = action_permutation.map(action => probs[action]);
    return probs_permuted;
  })();
  $: policy_cum_probs_permuted = (function() {
    let cum_probs = policy_probs_permuted.reduce((cum_probs, prob) =>
      cum_probs.concat([cum_probs[cum_probs.length - 1] + prob]), [0]);
    cum_probs.pop();
    return cum_probs;
  })();
</script>

<style>
 table {
   border-collapse: collapse;
   margin: 0em auto 0.5em auto;
   border-bottom: none;
   width: 100%;
 }

 .container {
   position: absolute;
   overflow: hidden;
   white-space: nowrap;
 }

 th {
   padding: 0.25em;
   text-align: left;
   vertical-align: middle;
   font-size: initial;
   border-bottom: 1px solid gray;
   white-space: nowrap;
 }

 .box {
   font-weight: bold;
   padding: 0.2em;
   border: 1px solid gray;
   border-radius: 0.25em;
 }
</style>

<table>
  <tr style="height: {policy_display_height};">
    <!-- <td>
      {#if state.position > 0 && rewards[state.position - 1] !== 0}
        <span>
          last reward:
          <span style="font-weight: bold; color: {bold_color};">{rewards[state.position - 1]}</span>
        </span>
      {/if}
    </td>
    <td>
      {#if state.position > 0 && dones[state.position - 1]}
        <span style="font-weight: bold; color: {bold_color};">new episode</span>
      {/if}
    </td>
    <td>frame: <span style="font-weight: bold; color: {bold_color};">{@html state.position + 1}</span></td> -->
    <th>
      Attribution for:<br>
    </th>
    <th>
      {#if attribution_kinds[0].type === "v"}
        <span class="box" style="font-weight: normal;">Value function</span>
      {:else if attribution_kinds[0].type === "action"}
        <span class="box">{@html action_htmls[attribution_kinds[0].data]}</span>
      {/if}
    </th>
    <th>
      <button on:click={() => show_attribution_selector = !show_attribution_selector}>
        {#if show_attribution_selector}
          <span>hide choices</span>
        {:else}
          <span>show choices</span>
        {/if}
      </button>
    </th>
    <!-- <th style="text-align: right; width: 17.5%;">
      Next action:
    </th>
    <th>
      <span class="box" style="color: {bold_color};">
        {@html action_htmls[actions[state.position]]}
      </span>
    </th> --><th style="width: 7.5%;"></th>
    <th style="text-align: right; width: 22.5%;">
      Policy: <span style="font-size: 0.9em; font-weight: normal;">(probabilities and sampled action)</span>
    </th>
    <th style="text-align: right; font-weight: normal; width: 60%; padding: 0.1em;">
      <div style="display: inline-block;
                  position: relative;
                  height: {policy_display_height};
                  width: 100%;
                  vertical-align: middle;"
      >
        {#each action_permutation as action, action_index}
          <div
            class="container label center-text"
            style="left: {(policy_cum_probs_permuted[action_index] * 100).toFixed(10)}%;
                   height: 100%;
                   width: {(policy_probs_permuted[action_index] * 100).toFixed(10)}%;
                   color: {action === actions[state.position] ? 'black' : 'white'};
                   background-color: {action === actions[state.position] ? 'white': action_colors[action_index]};
                   font-weight: {action === actions[state.position] ? 'bold': 'normal'};
                   border-width: 1px;
                   border-style: solid;
                   border-color: gray;
                   border-radius: 0.25em;"
          >{@html action_htmls[action]}</div>
        {/each}
      </div>
    </th>
  </tr>
</table>
