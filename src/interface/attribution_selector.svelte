<script>
  export let type = null;
  export let data = null;
  export let action_htmls = null;
  export let action_groups = null;
  export let action_colors = null;
  export let max_width;
  export let action_permutation;

  let type_and_data;
  const update_type_and_data = function(type, data) {
    type_and_data = type + (data === null ? "" : ":" + data.toString());
  }
  update_type_and_data(type, data);

  $: {
    if (type_and_data.indexOf(":") === -1) {
      type = type_and_data;
      data = null;
    }
    else {
      let type_and_data_split = type_and_data.split(":");
      type = type_and_data_split[0];
      data = parseInt(type_and_data_split[1]);
    }
  }
  $: update_type_and_data(type, data);
</script>

<style>
 th {
   text-align: right;
   font-weight: normal;
   border-bottom: 1px solid gray;
   line-height: 2em;
   padding: 0.25em;
 }
 
 label {
   padding: 0.2em;
   white-space: nowrap;
   border-radius: 0.25em;
 }
</style>

<th>
  <label style="{type_and_data === 'v' ? 'opacity: 1; border: 1px solid gray;' : 'opacity: 0.75; border: 1px solid lightgray;'}">
    <input type="radio" bind:group={type_and_data} value="v">
    Value function
  </label>
</th>
<th>
  {#each action_permutation as action, action_index}
    <label style="background-color: {action_colors[action_index]}; color: white; {type_and_data === 'action:' + action.toString() ? 'opacity: 1; border: 1px solid gray;' : 'opacity: 0.5; border: 1px solid lightgray;'}">
      <input type="radio" bind:group={type_and_data} value="action:{action}">
      {@html action_htmls[action]}
    </label>
    <span></span>
  {/each}
</th>
