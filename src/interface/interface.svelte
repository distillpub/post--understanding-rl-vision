<script>
  import TrajectoryDisplay from './trajectory_display.svelte';
  import Navigator from './navigator.svelte';
  import Screen from './screen.svelte';
  import Graph from './graph.svelte';
  import AttributionViewer from './attribution_viewer.svelte';
  import Legend from './legend.svelte';
  import { css_multiply } from './css_manipulate.js';

  export let input_layer = "input";
  export let layers = [];
  export let attribution = {};
  export let attribution_policy = false;
  export let attribution_single_channels = true;
  export let attribution_totals = {};
  export let colors = {
    features: [],
    actions: [],
    graphs: {
      v: "green",
      action: "red",
      action_group: "orange",
      advantage: "blue"
    },
    trajectory: "blue"
  };
  export let action_combos = [];
  export let action_groups = [];
  export let trajectories = {
    actions: [],
    policy_logits: [],
    values: [],
    advantages: []
  };
  export let bookmarks = {
    high: [],
    low: []
  };
  export let subdirs = {
    trajectories: "trajectories/",
    trajectories_scrub: "trajectories_scrub/",
    thumbnails: "thumbnails/",
    attribution: "attribution/",
    attribution_scrub: "attribution_scrub/",
    attribution_totals: "attribution_totals/"
  };
  export let formatting = {
    video_height: "0px",
    video_width: "0px",
    video_speed: 25,
    policy_display_height: "0px",
    policy_display_width: "0px",
    navigator_width: "0px",
    scrubber_height: "0px",
    scrubber_width: "0px",
    scrubber_visible_duration: 128,
    legend_item_height: "0px",
    legend_item_width: "0px",
    attribution_weight: 0.9
  };
  export let init = {
    layer: layers[Math.floor(layers.length / 2)],
    attribution_kinds: [{type: "v", data: null}],
    attribution_residual: false
    /* attribution_options: [
     *   {direction: "non", channel: "all", show_trajectory: true},
     *   {direction: "pos", channel: "all", show_trajectory: true},
     *   {direction: "neg", channel: "all", show_trajectory: true}
     * ] */
  };
  export let json_namespace_prefix = "";
  export let json_preloaded = {};
  export let extra_options = {
    init_focus: false,
    init_position: 0,
    init_playing: false,
    show_trajectory_display: true,
    show_navigator: true,
    show_scrubbers: true,
    show_attribution_selector_init: true,
    show_attribution_toggles: true,
    show_attribution_chart: true,
    show_residual_legend_item: true,
    show_news_text: false,
    show_extra_help_text: false,
    simple_navigator: false,
    navigation_above: true,
    action_permutation: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    scrubber_indicator_width: 2,
    graph_label_right_margin: 8,
    graph_stroke_width: 0.5,
    chart_quantile_to_overflow: 0.9,
    chart_max_overflow: 5,
    chart_fixed_upper_value: null,
    chart_fixed_lower_value: null,
    feature_descriptions: colors.features.map(() => null),
    epilepsy_warning: false,    
  };

  const action_htmls = action_combos.map(function(combo) {
    let right = false;
    let left = false;
    let up = false;
    let down = false;
    let non_arrows = []
    for (let button of combo) {
      if (button.toUpperCase() === "RIGHT") {
        right = true;
      }
      else if (button.toUpperCase() === "LEFT") {
        left = true;
      }
      else if (button.toUpperCase() === "UP") {
        up = true;
      }
      else if (button.toUpperCase() === "DOWN") {
        down = true;
      }
      else {
        non_arrows.push(button);
      }
    }
    let arrows = [];
    if (right && up) {
      arrows.push("&#8599;");
    }
    else if (left && up) {
      arrows.push("&#8598;");
    }
    else if (right && down) {
      arrows.push("&#8600;");
    }
    else if (left && down) {
      arrows.push("&#8601;");
    }
    else if (right) {
      arrows.push("&#8594;");
    }
    else if (left) {
      arrows.push("&#8592;");
    }
    else if (up) {
      arrows.push("&#8593;");
    }
    else if (down) {
      arrows.push("&#8595;");
    }
    if (arrows.length === 0 && non_arrows.length === 0) {
      return "no-op";
    }
    else {
      return arrows.concat(non_arrows).join("+");
    }
  });

  export let video_state = {
    position: extra_options.init_position,
    velocity_direction: (extra_options.init_playing ? 1 : 0)
  };

  $: max_duration = (function() {
    return Math.max.apply(null, Object.values(trajectories).map(
      arr => arr[attribution.trajectory].length));
  })();
  let attribution_residual = init.attribution_residual;
  let show_attribution_selector = extra_options.show_attribution_selector_init;

  let attribution_kinds = [];
  export let attribution_kind = init.attribution_kinds[0];
  $: {
    attribution_kinds[0] = attribution_kind;
    init.attribution_kinds[0] = attribution_kind;
  }
  $: graphs = (function() {
    let trajectory = attribution.trajectory;
    let graphs = []; /* [{
      type: "advantage",
      data: null,
      title: "advantage",
      series: trajectories.advantages[trajectory],
      dones: trajectories.dones[trajectory]
    }]; */
    for (let attribution_kind of attribution_kinds) {
      if (attribution_kind !== null) {
        let graph = {
          type: attribution_kind.type,
          data: attribution_kind.data
        };
        let duplicate = false;
        for (let existing_graph of graphs) {
          if (graph.type === existing_graph.type && graph.data === existing_graph.data) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          if (graph.type === "v"){
            graph.title = "Value function";
            graph.series = trajectories.values[trajectory];
          }
          else if (graph.type === "action") {
            graph.title = action_htmls[graph.data] + " logit";
            graph.series = trajectories.policy_logits[trajectory].map(
              logits => logits[graph.data]);
          }
          else if (graph.type === "action_group") {
            let actions = action_groups[graph.data];
            graph.title = "[ " + actions.map(action => action_htmls[action]).join(" | ") + " ] logit sum";
            graph.series = trajectories.policy_logits[trajectory].map(logits => logits.reduce(
              (total, logit, action) => total + (actions.indexOf(action) === -1 ? 0 : logit), 0));
          }
          else {
            graph = null;
          }
          if (graph !== null) {
            graph.dones = trajectories.dones[trajectory];
            graphs.push(graph);
          }
        }
      }
    }
    return graphs;
  })();
  let attribution_single_channel = null;

  let navigator_div;
</script>

<style>
 :global(.center-text) {
   display: -webkit-box;
   display: -webkit-flex;
   display: -moz-box;
   display: -ms-flexbox;
   display: flex;
   -webkit-flex-align: center;
   -ms-flex-align: center;
   -webkit-align-items: center;
   align-items: center;
   justify-content: center;
   text-align: center;
 }

 :global(.grayscale) {
   filter: gray;
   -webkit-filter: grayscale(1);
   filter: grayscale(1);
 }

 :global(.opaque-hover:hover) {
   filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'opaque\'><feComponentTransfer><feFuncA type=\'table\' tableValues=\'1 1\'/></feComponentTransfer></filter></svg>#opaque");
 }
 
 :global(.striped) {
   /* background-image: -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, lightgray), color-stop(.25, transparent), to(transparent)),
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, lightgray), color-stop(.25, transparent), to(transparent)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, lightgray)),
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, lightgray)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0, whitesmoke), color-stop(1, whitesmoke));
      background-image: -webkit-linear-gradient(45deg, lightgray 25%, transparent 25%, transparent),
      -webkit-linear-gradient(-45deg, lightgray 25%, transparent 25%, transparent),
      -webkit-linear-gradient(45deg, transparent 75%, lightgray 75%),
      -webkit-linear-gradient(-45deg, transparent 75%, lightgray 75%),
      -webkit-linear-gradient(0deg, whitesmoke 0%, whitesmoke 100%);
      background-image: -moz-linear-gradient(45deg, lightgray 25%, transparent 25%, transparent),
      -moz-linear-gradient(-45deg, lightgray 25%, transparent 25%, transparent),
      -moz-linear-gradient(45deg, transparent 75%, lightgray 75%),
      -moz-linear-gradient(-45deg, transparent 75%, lightgray 75%),
      -moz-linear-gradient(0deg, whitesmoke 0%, whitesmoke 100%);
      background-image: -ms-linear-gradient(45deg, lightgray 25%, transparent 25%, transparent),
      -ms-linear-gradient(-45deg, lightgray 25%, transparent 25%, transparent),
      -ms-linear-gradient(45deg, transparent 75%, lightgray 75%),
      -ms-linear-gradient(-45deg, transparent 75%, lightgray 75%),
      -ms-linear-gradient(0deg, whitesmoke 0%, whitesmoke 100%);
      background-image: -o-linear-gradient(45deg, lightgray 25%, transparent 25%, transparent),
      -o-linear-gradient(-45deg, lightgray 25%, transparent 25%, transparent),
      -o-linear-gradient(45deg, transparent 75%, lightgray 75%),
      -o-linear-gradient(-45deg, transparent 75%, lightgray 75%),
      -o-linear-gradient(0deg, whitesmoke 0%, whitesmoke 100%);
      background-image: linear-gradient(45deg, lightgray 25%, transparent 25%, transparent),
      linear-gradient(-45deg, lightgray 25%, transparent 25%, transparent),
      linear-gradient(45deg, transparent 75%, lightgray 75%),
      linear-gradient(-45deg, transparent 75%, lightgray 75%),
      linear-gradient(0deg, whitesmoke 0%, whitesmoke 100%);
      background-size: 0.5em 0.5em; */
   background: repeating-linear-gradient(135deg, lightgray 0px, whitesmoke 10px, lightgray 20px);
 }

 :global(.underrule) {
   border-bottom: 1px solid gray;
 }

 :global(.pixelated){
   image-rendering: optimizeSpeed;
   image-rendering: -moz-crisp-edges;
   image-rendering: -o-crisp-edges;
   image-rendering: -webkit-optimize-contrast;
   image-rendering: optimize-contrast;
   image-rendering: crisp-edges;
   image-rendering: pixelated;
   -ms-interpolation-mode: nearest-neighbor;
 }

 .indicator {
   margin: 0 auto;
   border-width: 0px 6px;
   border-color: #a3a3a3;
   border-style: solid;
   background: white;
 }
</style>

<svelte:window on:load={() => {if (extra_options.init_focus) {navigator_div.focus();}}}/>

<div> <!-- on:click={() => navigator_div.focus()}> -->

  {#if extra_options.navigation_above}

    {#if extra_options.show_navigator}
      <Navigator
        bind:state={video_state}
        bind:speed={formatting.video_speed}
        width={formatting.navigator_width}
        max_duration={max_duration}
        bind:navigator_div={navigator_div}
        simple={extra_options.simple_navigator}
      />
    {/if}

    {#if extra_options.show_scrubbers}

      <div style="width: {formatting.scrubber_width};
                  margin: 0 auto;
                  background: whitesmoke;
                  border: 1px solid gray;
                  border-radius: 0.5em;
                  box-shadow: inset 0 0 0.5em gray;">

        <div style="height: {css_multiply(formatting.scrubber_height, 0.2)};
                    width: {extra_options.scrubber_indicator_width}px;
                    margin: 0 auto;
                    border-width: 0px 6px;
                    border-color: black;
                    border-style: solid;
                    opacity: 0.4;"
        ></div>

        <Screen
          image_dir={subdirs.trajectories_scrub}
          images={[attribution.trajectory + ".png"]}
          durations={[max_duration]}
          bind:state={video_state}
          height={formatting.scrubber_height}
          width={formatting.scrubber_width}
          visible_duration={formatting.scrubber_visible_duration}
          scrubber_indicator_width={extra_options.scrubber_indicator_width}
        />

        {#each graphs as graph}
          <Graph
            titles={[graph.title]}
            series={[graph.series]}
            dones={[graph.dones]}
            colors={[colors.graphs[graph.type]]}
            bind:state={video_state}
            height={formatting.scrubber_height}
            width={formatting.scrubber_width}
            visible_duration={formatting.scrubber_visible_duration}
            stroke_width={extra_options.graph_stroke_width}
            show_extra_help_text={extra_options.show_extra_help_text}
            scrubber_indicator_width={extra_options.scrubber_indicator_width}
            label_right_margin={extra_options.graph_label_right_margin}
          />
        {/each}

        <div class="indicator" style="height: {css_multiply(formatting.scrubber_height, 0.05)}; width: {extra_options.scrubber_indicator_width}px;"></div>

        <div class="indicator" style="height: {css_multiply(formatting.scrubber_height, 0.05)}; width: {extra_options.scrubber_indicator_width + 2}px;"></div>

        <div class="indicator" style="height: {css_multiply(formatting.scrubber_height, 0.05)}; width: {extra_options.scrubber_indicator_width + 6}px;"></div>

        <div class="indicator" style="height: {css_multiply(formatting.scrubber_height, 0.05)}; width: {extra_options.scrubber_indicator_width + 12}px;"></div>

      </div>

    {/if}

  {/if}

  <div style="position: relative;
              display: table;
              margin: 0 auto;
              padding: 0.5em;
              border-top: {extra_options.show_scrubbers && extra_options.navigation_above ? '1px solid black' : 'none'};
              border-bottom: none;
              border-radius: 1em;
              text-align: center;">
    {#if extra_options.show_scrubbers && extra_options.navigation_above}
      <div style="position: absolute;
                  top: 0%;
                  left: 50%;
                  margin-top: -2px;
                  margin-left: -{(extra_options.scrubber_indicator_width / 2) + 12}px;
                  height: 4px;
                  width: {extra_options.scrubber_indicator_width + 23}px;
                  background-color: white;"
      ></div>
    {/if}
    {#if extra_options.show_trajectory_display}
      <TrajectoryDisplay
        actions={trajectories.actions[attribution.trajectory]}
        rewards={trajectories.rewards[attribution.trajectory]}
        dones={trajectories.dones[attribution.trajectory]}
        policy_logits={trajectories.policy_logits[attribution.trajectory]}
        bind:state={video_state}
        action_htmls={action_htmls}
        action_colors={colors.actions}
        bold_color={colors.trajectory}
        policy_display_height={formatting.policy_display_height}
        policy_display_width={formatting.policy_display_width}
        action_permutation={extra_options.action_permutation}
        attribution_kinds={attribution_kinds}
        bind:show_attribution_selector={show_attribution_selector}
      />
    {/if}
    <AttributionViewer
      layer={attribution.layer}
      trajectory={attribution.trajectory}
      subdirs={subdirs}
      images={attribution.images}
      metadata={attribution.metadata}
      channel_totals_jsons={attribution_totals.channels}
      residual_totals_jsons={attribution_totals.residuals}
      totals_metadata={attribution_totals.metadata}
      json_namespace_prefix={json_namespace_prefix}
      json_preloaded={json_preloaded}
      bind:state={video_state}
      bind:attribution_kinds={attribution_kinds}
      initial_attribution_kinds={init.attribution_kinds}
      action_htmls={action_htmls}
      action_groups={action_groups}
      max_duration={max_duration}
      video_height={formatting.video_height}
      video_width={formatting.video_width}
      attribution_weight={formatting.attribution_weight}
      attribution_or_gradients={attribution.layer !== input_layer ? "attribution" : "gradients"}
      bind:attribution_residual={attribution_residual}
      attribution_policy={attribution_policy}
      attribution_single_channel={attribution_single_channel}
      channel_colors={colors.features}
      action_colors={colors.actions}
      show_toggles={extra_options.show_attribution_toggles}
      show_chart={extra_options.show_attribution_chart}
      show_news_text={extra_options.show_news_text}
      show_extra_help_text={extra_options.show_extra_help_text}
      show_attribution_selector={show_attribution_selector}
      action_permutation={extra_options.action_permutation}
      chart_quantile_to_overflow={extra_options.chart_quantile_to_overflow}
      chart_max_overflow={extra_options.chart_max_overflow}
      chart_fixed_upper_value={extra_options.chart_fixed_upper_value}
      chart_fixed_lower_value={extra_options.chart_fixed_lower_value}
    />
    {#if attribution.layer !== input_layer}
      <div style="display: table; margin: 0 auto;">
        <div class="{extra_options.show_extra_help_text ? '' : 'underrule'}" style="display: inline-block; width: 100%; text-align: left; font-weight: bold; margin-bottom: 0.25em;{extra_options.show_extra_help_text ? ' line-height: 1.1em;' : ''}">
          Attribution legend
          <span style="font-weight: normal;">(hover to isolate)</span>
          {#if extra_options.show_extra_help_text}
            <br>
            <span style="font-weight: normal; font-size: 0.75em; color: gray;">
              Colors correspond to vector components after dimensionality reduction, icons show dataset examples, and labels are hand-composed
            </span>
          {/if}
        </div>
        <br>
        <Legend
          image_dir={subdirs.thumbnails}
          image={attribution.layer.replace(/\//g, "").replace(/_/g, "") + ".png"}
          colors={colors.features}
          labels_below={extra_options.feature_descriptions}
          item_height={formatting.legend_item_height}
          item_width={formatting.legend_item_width}
          show_residual={attribution_residual}
          bind:selected_channel={attribution_single_channel}
          enable_hover={attribution_single_channels}
          show_residual_legend_item={extra_options.show_residual_legend_item}
        />
      </div>
    {:else}
      <div class="underrule" style="display: inline-block; width: 100%; text-align: left; font-weight: bold; margin-bottom: 0.25em;">Gradients legend</div>
      <br>
      <p>Colors correspond<br>to input colors</p>
    {/if}
  </div>

  {#if !extra_options.navigation_above}

    <div style="position: relative;
                height: {css_multiply(formatting.scrubber_height, 2.4)};
                width: {css_multiply(formatting.scrubber_width, extra_options.show_navigator ? 1.3 : 1)};
                margin: 0 auto;"
    >

      {#if extra_options.show_navigator}
        <div style="position: absolute; top: 0em; left: 0em;">
          <div style="font-weight: bold; margin-bottom: 1em;">Timeline</div>
          {#if extra_options.epilepsy_warning}
            <div style="position: relative;">
              <div style="position: absolute; color: red; margin-top: -2em; font-size: 0.75em; text-decoration: underline dashed; cursor: pointer;" title="Playing this visualization displays flashing colors, which could adversely affect people with photosensitive epilepsy.">Epilepsy warning</div>
            </div>
          {/if}
          <Navigator
            bind:state={video_state}
            bind:speed={formatting.video_speed}
            width={css_multiply(formatting.scrubber_width, 0.25)}
            max_duration={max_duration}
            bind:navigator_div={navigator_div}
            simple={extra_options.simple_navigator}
          />
        </div>
      {/if}

      {#if extra_options.show_scrubbers}

        <div style="position: absolute;
                    top: 0px;
                    left: {css_multiply(formatting.scrubber_width, extra_options.show_navigator ? 0.3 : 0)};
                    width: {formatting.scrubber_width};
                    background: whitesmoke;
                    border: 1px solid gray;
                    border-radius: 0.5em;
                    box-shadow: inset 0 0 0.5em gray;"
        >

          <div style="height: {css_multiply(formatting.scrubber_height, 0.2)};
                      width: {extra_options.scrubber_indicator_width}px;
                      margin: 0 auto;
                      border-width: 0px 6px;
                      border-color: black;
                      border-style: solid;
                      opacity: 0.4;"
          ></div>

          <Screen
            image_dir={subdirs.trajectories_scrub}
            images={[attribution.trajectory + ".png"]}
            durations={[max_duration]}
            bind:state={video_state}
            height={formatting.scrubber_height}
            width={formatting.scrubber_width}
            visible_duration={formatting.scrubber_visible_duration}
            scrubber_indicator_width={extra_options.scrubber_indicator_width}
          />

          {#each graphs as graph}
            <Graph
              titles={[graph.title]}
              series={[graph.series]}
              dones={[graph.dones]}
              colors={[colors.graphs[graph.type]]}
              bind:state={video_state}
              height={formatting.scrubber_height}
              width={formatting.scrubber_width}
              visible_duration={formatting.scrubber_visible_duration}
              stroke_width={extra_options.graph_stroke_width}
              show_extra_help_text={extra_options.show_extra_help_text}
              scrubber_indicator_width={extra_options.scrubber_indicator_width}
              label_right_margin={extra_options.graph_label_right_margin}
            />
          {/each}

          <div style="height: {css_multiply(formatting.scrubber_height, 0.2)};
                      width: {extra_options.scrubber_indicator_width}px;
                      margin: 0 auto;
                      border-width: 0px 6px;
                      border-color: black;
                      border-style: solid;
                      opacity: 0.4;"
          ></div>

        </div>

      {/if}

    </div>

  {/if}

</div>
