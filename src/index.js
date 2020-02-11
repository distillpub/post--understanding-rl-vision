// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import Interface from "./interface/interface.svelte";

const feature_descriptions = [
  "Buzzsaw<br>obstacle",
  "Coin",
  "Enemy<br>moving<br>left",
  "Agent<br>or enemy<br>moving right",
  "Buzzsaw<br>obstacle<br>or platform",
  "Platform",
  "Velocity<br>info or left-<br>facing wall",
  "Step"
];

const action_permutation = [2, 1, 6, 3, 4, 5, 7, 8, 0];

const add_path_prefix = function(props, path_prefix) {
  for (let subdir in props.subdirs) {
    if (Object.prototype.hasOwnProperty.call(props.subdirs, subdir)) {
      props.subdirs[subdir] = path_prefix + props.subdirs[subdir];
    }
  }
  for (let path in props.json_preloaded) {
    if (Object.prototype.hasOwnProperty.call(props.json_preloaded, path)) {
      props.json_preloaded[path_prefix + path] = props.json_preloaded[path];
      delete props.json_preloaded[path];
    }
  }
};

const adjust_options = function(props) {
  props.action_combos[0] = ["C"];
  props.colors.actions = ["#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3"];
  props.colors.graphs.v = "black";
  props.colors.trajectory = "black";
  props.formatting.video_speed = 12;
  props.formatting.policy_display_height = "1.8em";
  props.formatting.navigator_width = "36em";
  props.formatting.scrubber_width = "36em";
  props.formatting.legend_item_height = "5.5em";
  props.formatting.legend_item_width = "5.5em";
};

let interfaces = {};
let interface_props = {};
let interface_positions = {};

const initialize_interface = function(props, extra_options, name) {
  adjust_options(props);
  add_path_prefix(props, "interfaces/" + name + "/");
  props.extra_options = extra_options;
  props.json_namespace_prefix = name;
  interface_props[name] = props;
  interface_positions[name] = props.extra_options.init_position;
  document.addEventListener("DOMContentLoaded", function() {
    const target = document.getElementById("interface-" + name.replace(/_/g, "-") + "-target");
    interfaces[name] = new Interface({ target, props });
  });
};

import props_header from "./props_header.js";
let extra_options_header = {
  init_focus: false,
  init_position: 332,
  init_playing: false,
  show_navigator: true,
  show_trajectory_display: false,
  show_scrubbers: true,
  show_attribution_selector_init: false,
  show_attribution_toggles: false,
  show_attribution_chart: false,
  show_residual_legend_item: true,
  show_news_text: true,
  show_extra_help_text: true,
  simple_navigator: true,
  navigation_above: false,
  action_permutation,
  graph_stroke_width: 0.75,
  chart_quantile_to_overflow: 0.95,
  chart_max_overflow: 5,
  chart_fixed_upper_value: null,
  chart_fixed_lower_value: null,
  feature_descriptions
};
initialize_interface(props_header, extra_options_header, "header");

let extra_options_bug = {
  init_focus: false,
  init_position: 2,
  init_playing: false,
  show_navigator: false,
  show_trajectory_display: false,
  show_scrubbers: true,
  show_attribution_selector_init: false,
  show_attribution_toggles: false,
  show_attribution_chart: true,
  show_residual_legend_item: true,
  show_news_text: false,
  show_extra_help_text: false,
  simple_navigator: false,
  navigation_above: true,
  action_permutation,
  graph_stroke_width: 0.025,
  chart_quantile_to_overflow: 0.95,
  chart_max_overflow: 0.95,
  chart_fixed_upper_value: null,
  chart_fixed_lower_value: null,
  feature_descriptions
};

const adjust_options_bug = function(props) {
  props.formatting.scrubber_visible_duration = 9;
};

import props_bug_coin from "./props_bug_coin.js";
adjust_options_bug(props_bug_coin);
initialize_interface(props_bug_coin, extra_options_bug, "bug_coin");

import props_bug_saw from "./props_bug_saw.js";
adjust_options_bug(props_bug_saw);
initialize_interface(props_bug_saw, extra_options_bug, "bug_saw");

let extra_options_failure = {
  init_focus: false,
  init_position: 0,
  init_playing: false,
  show_navigator: false,
  show_trajectory_display: true,
  show_scrubbers: false,
  show_attribution_selector_init: false,
  show_attribution_toggles: false,
  show_attribution_chart: true,
  show_residual_legend_item: true,
  show_news_text: false,
  show_extra_help_text: false,
  simple_navigator: false,
  navigation_above: true,
  action_permutation,
  graph_stroke_width: 0.5,
  chart_quantile_to_overflow: 0.8,
  chart_max_overflow: 8,
  chart_fixed_upper_value: 2.5,
  chart_fixed_lower_value: -2.5,
  feature_descriptions
};

import props_failure_obscured from "./props_failure_obscured.js";
initialize_interface(props_failure_obscured, extra_options_failure, "failure_obscured");

import props_failure_down from "./props_failure_down.js";
initialize_interface(props_failure_down, extra_options_failure, "failure_down");

import props_failure_offscreen from "./props_failure_offscreen.js";
initialize_interface(props_failure_offscreen, extra_options_failure, "failure_offscreen");

import props_100_levels from "./props_100_levels.js";
let extra_options_100_levels = Object.assign({}, extra_options_header);
extra_options_100_levels.init_position = 31;
extra_options_100_levels.feature_descriptions = ["???", "???", "???", "???", "???", "???", "???", "Agent, walls<br>and velocity<br>info?"];
(function (){
  for (let feature_number = 0; feature_number < extra_options_100_levels.feature_descriptions.length; feature_number++) {
    if (extra_options_100_levels.feature_descriptions[feature_number] === "???") {
      extra_options_100_levels.feature_descriptions[feature_number] = "<span style=\"font-size: 1.25em;\">&emsp;???</span>";
    }
  }
})();
initialize_interface(props_100_levels, extra_options_100_levels, "100_levels");

const preload_images = function(urls) {
  for (let url of urls) {
    let img = new Image();
    img.src = url;
  }
};

document.addEventListener("DOMContentLoaded", function() {
  for (let feature_number = 0; feature_number < 4; feature_number++) {
    preload_images([
      "images/attribution/attribution_pos_" + feature_number.toString() + ".png",
      "images/attribution/attribution_neg_" + feature_number.toString() + ".png"
    ]);
    document.getElementById("attribution-legend-item-" + feature_number.toString()).addEventListener("mouseover", (function(feature_number) {
      return function() {
        document.getElementById("attribution-overlay-pos").style.backgroundImage="url('images/attribution/attribution_pos_" + feature_number.toString() + ".png')";
        document.getElementById("attribution-overlay-neg").style.backgroundImage="url('images/attribution/attribution_neg_" + feature_number.toString() + ".png')";
      };
    })(feature_number));
    document.getElementById("attribution-legend-item-" + feature_number.toString()).addEventListener("mouseout", function() {
      document.getElementById("attribution-overlay-pos").style.backgroundImage="url('images/attribution/attribution_pos.png')";
      document.getElementById("attribution-overlay-neg").style.backgroundImage="url('images/attribution/attribution_neg.png')";
    });
  }
});

const restyle_class = function(className, attribute, value) {
  for (let tag of document.getElementsByClassName(className)) {
    tag.style[attribute] = value;
  }
};

document.addEventListener("DOMContentLoaded", function() {
  for (let feature_number = 0; feature_number < 3; feature_number++) {
    preload_images([
      "images/hero/attribution_pos_" + feature_number.toString() + ".png",
      "images/hero/attribution_neg_" + feature_number.toString() + ".png",
      "images/hero/observation_" + feature_number.toString() + ".png"
    ]);
    document.getElementById("hero-annotation-" + feature_number.toString()).addEventListener("mouseover", (function(feature_number) {
      return function() {
        document.getElementById("hero-overlay-pos").style.backgroundImage="url('images/hero/attribution_pos_" + feature_number.toString() + ".png')";
        document.getElementById("hero-overlay-neg").style.backgroundImage="url('images/hero/attribution_neg_" + feature_number.toString() + ".png')";
        document.getElementById("hero-observation").style.backgroundImage="url('images/hero/observation_" + feature_number.toString() + ".png')";
        for (let other_feature_number = 0; other_feature_number < 3; other_feature_number++) {
          if (other_feature_number !== feature_number) {
            document.getElementById("hero-annotation-" + other_feature_number.toString()).style.WebkitFilter = "grayscale(1) brightness(0.75)";
            document.getElementById("hero-annotation-" + other_feature_number.toString()).style.filter = "grayscale(1) brightness(0.75)";
            document.getElementById("hero-annotation-lines-" + other_feature_number.toString()).style.display = "none";
          }
        }
      };
    })(feature_number));
    document.getElementById("hero-annotation-" + feature_number.toString()).addEventListener("mouseout", function() {
      document.getElementById("hero-overlay-pos").style.backgroundImage="url('images/hero/attribution_pos.png')";
      document.getElementById("hero-overlay-neg").style.backgroundImage="url('images/hero/attribution_neg.png')";
      document.getElementById("hero-observation").style.backgroundImage="url('images/hero/observation.png')";
      for (let other_feature_number = 0; other_feature_number < 3; other_feature_number++) {
        document.getElementById("hero-annotation-" + other_feature_number.toString()).style.WebkitFilter = "none";
        document.getElementById("hero-annotation-" + other_feature_number.toString()).style.filter = "none";
        document.getElementById("hero-annotation-lines-" + other_feature_number.toString()).style.display = "block";
      }
    });
  }
  window.setInterval(function() {
    let attribution_height = Math.max(document.getElementById("hero-overlay-pos").scrollHeight, document.getElementById("hero-overlay-neg").scrollHeight);
    let originally_zero = attribution_height * 0.42 - 128.5;
    restyle_class("hero-annotation-line-vertical-outer", "top", (- (originally_zero + 142)) + "px");
    restyle_class("hero-annotation-line-vertical-outer", "height", (originally_zero + 137) + "px");
    restyle_class("hero-annotation-line-vertical-inner", "height", (originally_zero + 143) + "px");
    restyle_class("hero-annotation-line-horizontal-outer", "top", (- (originally_zero + 144)) + "px");
  }, 500);
});

const interface_bug_failure_options = {
  "bug": ["coin", "saw"],
  "failure": ["obscured", "down", "offscreen"]
}

let current_failure_option = interface_bug_failure_options["failure"][0];

const feature_bullet_html = function(id, number) {
  let color = interface_props[id].colors.features[number - 1];
  return "<span style=\"color: " + color + "; font-weight: 900;\">&bull;</span>";
};

const residual_bullet_html = function() {
  return "&#9702;";
};

const failure_descriptions = {
  "obscured": [
    [[1, 1], "The agent moves right, invited by the unoccupied floor (" + feature_bullet_html("failure_obscured", 5) + " " + feature_bullet_html("failure_obscured", 6) + ") in front of it."],
    [[2, 2], "The agent prepares to jump, seeing the wall (" + feature_bullet_html("failure_obscured", 7) + ") up ahead."],
    [[3, 3], "The agent jumps by releasing up, analyzing something (" + residual_bullet_html() + ") on the wall. (The \"residual\" feature can be triggered by a number of different objects, and can be viewed by hovering over the last legend item.)"],
    [[4, 6], "The agent is in mid-air, trying to control its horizontal motion. Its policy has higher entropy as its actions matter less at the start of a jump (due to the entropy bonus used in PPO)."],
    [[7, 8], "The agent moves right to be able to reach the top of the wall (" + feature_bullet_html("failure_obscured", 7) + "), though it is slightly discouraged from doing so by the prescence of the enemy moving right (" + feature_bullet_html("failure_obscured", 4) + ")."],
    [[9, 13], "Having adjusted its horizontal motion, the agent returns to a policy with higher entropy. It is paying attention to the enemy moving right (" + feature_bullet_html("failure_obscured", 4) + "), which it is on track to avoid, but it cannot see the buzzsaw obstacle (" + feature_bullet_html("failure_obscured", 1) + ") obscured from view behind it. With some bad luck, the agent happens to move right at every timestep during this period."],
    [[14, 14], "Finally the buzzsaw obstacle (" + feature_bullet_html("failure_obscured", 1) + ") comes into view, and the agent tries to move left to avoid it."],
    [[15, 15], "For some reason the agent no longer seems to realize that it is on track to collide with the buzzsaw obstacle (" + feature_bullet_html("failure_obscured", 1) + "), and returns to a policy with higher entropy. With further bad luck, the agent again happens to move right."],
    [[16, 17], "The danger of the buzzsaw obstacle (" + feature_bullet_html("failure_obscured", 1) + ") becomes clear to the agent again. The agent tries to move left to avoid it, and also prepares to immediately jump upon landing. Pulling off the jump actually matters more to its chances of survival, since it is already moving right."],
    [[18, 18], "The agent makes a futile attempt to avoid the buzzsaw obstacle (" + feature_bullet_html("failure_obscured", 1) + ") by releasing up to jump, but it is too late, and the episode is terminated."]
  ],
  "down": [
    [[1, 1], "The agent prepares to jump, seeing the wall (" + feature_bullet_html("failure_obscured", 7) + ") immediately in front of it."],
    [[2, 3], "The agent's policy is dominated by the 3 upward directions (which delay the jump) and down (which cancels it). Any other action would trigger the jump. So the agent is trying to delay the jump, partly because of the enemy moving left (" + feature_bullet_html("failure_obscured", 3) + "), which both positively influences these actions and negatively influences others."],
    [[4, 4], "The agent's policy is still dominated by the 3 updward directions and down, and at this point the agent happens to move down. Unfortunately, the agent does not seem to have taken into account that this will cause it to step down from the box it is standing on and onto an enemy."],
    [[5, 5], "The agent is now happier to jump by releasing up, based on the position of the enemy moving left (" + feature_bullet_html("failure_obscured", 3) + "), seeming not to realize that the jump has already been cancelled."],
    [[6, 7], "The agent returns to a policy dominated by the 3 upward directions and down, seemingly influenced by the wall (" + feature_bullet_html("failure_obscured", 7) + ") in front of it and, for some reason, the buzzsaw obstacle (" + feature_bullet_html("failure_obscured", 1) + feature_bullet_html("failure_obscured", 5) + ") behind it. The agent's apparent confusion may be because it is already doomed, no matter which actions it takes."]
  ],
  "offscreen": [
    [[1, 1], "The agent moves right across the platform (" + feature_bullet_html("failure_obscured", 5) + " " + feature_bullet_html("failure_obscured", 6) + ") it is on."],
    [[2, 2], "The agent prepares to jump, seeing the wall (" + feature_bullet_html("failure_obscured", 7) + ") across the other side of the chasm ahead of it."],
    [[3, 3], "The agent jumps by releasing up."],
    [[4, 6], "The agent is in mid-air, trying to control its horizontal motion. Its policy has higher entropy as its actions matter less at the start of a jump (due to the entropy bonus used in PPO). Unfortunately, it happens to move left at every timestep during this period."],
    [[7, 8], "The agent notices that its horizontal velocity (" + feature_bullet_html("failure_obscured", 1) + " " + feature_bullet_html("failure_obscured", 2) + " " + feature_bullet_html("failure_obscured", 8) + ") has been reduced, and tries to move right to compensate. (Several features read from the velocity info as a secondary purpose.) With some bad luck, it moves up but not right on its first move."],
    [[9, 13], "The platforms have now moved below the agent's field of view. With little to go by, its policy has high entropy, with some bias towards moving right rather than left. With further bad luck, this rightward bias is not reflected in the actions sampled."],
    [[14, 18], "As the wall (" + feature_bullet_html("failure_obscured", 7) + ") across the other side of the chasm comes back into view, the agent can see that its horizontal velocity (" + feature_bullet_html("failure_obscured", 8) + ") is not high enough, and so it tries to move right."],
    [[19, 27], "The agent realizes from the wall (" + feature_bullet_html("failure_obscured", 7) + ") of the chasm that it has failed to complete the jump. The value function plummets to below 5%, and the policy degenerates."]
  ]
};

const get_failure_description = function(option, position) {
  let range_and_text = failure_descriptions[option].find(range => range[0][0] <= position + 1 && position + 1 <= range[0][1]);
  let range = range_and_text[0];
  let text = range_and_text[1];
  let positions = "Timesteps " + range[0].toString() + "&ndash;" + range[1].toString();
  if (range[0] == range[1]) {
    positions = "Timestep " + range[0].toString();
  }
  return [positions, text];
};

let failure_description_divs = [];

const append_all_failure_descriptions = function(option) {
  let duration = interface_props["failure_" + option].trajectories.actions[0].length;
  for (let position = 0; position < duration; position++) {
    let positions_and_text = get_failure_description(option, position);
    let positions = positions_and_text[0];
    let text = positions_and_text[1];
    let description_div = document.createElement("div");
    description_div.id = "interface-failure-description-" + option + "-" + position.toString();
    description_div.style.visibility = "hidden";
    description_div.style.position = "absolute";
    description_div.innerHTML = "<b>" + positions + "</b>: " + text;
    document.getElementById("interface-failure-description").appendChild(description_div);
    failure_description_divs.push(description_div);
  }
};

const fix_failure_description_height = function() {
  let height = 0;
  for (let description_div of failure_description_divs) {
    height = Math.max(height, description_div.offsetHeight);
  }
  document.getElementById("interface-failure-description").style.height = height + "px";
};

const arg_max = function(arr) {
  return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
};

const failure_action_overrides = {
  "obscured": {
    1: 4,
    14: 1,
  },
  "down": {
    1: 6,
    2: 0,
    3: 0
  },
  "offscreen": {
    18: "v",
    19: "v",
    20: "v",
    21: "v",
    22: "v",
    23: "v",
    24: "v",
    25: "v",
    26: "v"
  }
}

const update_failure_position = function(delta, absolute, loop){
  let option = current_failure_option;
  let duration = interface_props["failure_" + option].trajectories.actions[0].length;
  let new_position = delta;
  if (!absolute) {
    new_position += interface_positions["failure_" + option];
  }
  else if (new_position < 0) {
    new_position += duration;
  }
  if (loop) {
    new_position = new_position % duration;
  }
  else {
    new_position = Math.max(0, Math.min(duration - 1, new_position));
  }
  let new_action = arg_max(interface_props["failure_" + option].trajectories.policy_logits[0][new_position]);
  if (typeof(failure_action_overrides[option][new_position]) !== "undefined") {
    new_action = failure_action_overrides[option][new_position];
  }
  for (let description_div of failure_description_divs) {
    description_div.style.visibility = (description_div.id === "interface-failure-description-" + option + "-" + new_position.toString() ? "visible" : "hidden");
  }
  fix_failure_description_height();
  document.getElementById("interface-failure-previous").disabled = new_position === 0;
  document.getElementById("interface-failure-previous").style.cursor = new_position === 0 ? "auto" : "pointer";
  document.getElementById("interface-failure-next").disabled = new_position === (duration - 1);
  document.getElementById("interface-failure-next").style.cursor = new_position === (duration - 1) ? "auto" : "pointer";
  document.getElementById("interface-failure-position").innerHTML = "Timestep <b>" + (new_position + 1).toString() + "</b> of <b>" + duration.toString() + "</b>";
  interfaces["failure_" + option].$set({
    "video_state": {"position": new_position, "velocity_direction": 0},
    "attribution_kind": (new_action === "v" ? {"type": "v", "data": null} : {"type": "action", "data": new_action})
  });
  interface_positions["failure_" + option] = new_position;
};

const update_interface_bug_failure_option = function(bug_or_failure, choice) {
  for (let option of interface_bug_failure_options[bug_or_failure]) {
    document.getElementById("interface-" + bug_or_failure + "-" + option + "-target").style.display = choice === option ? "block" : "none";
    document.getElementById("interface-" + bug_or_failure + "-" + option + "-text").style.display = choice === option ? "block" : "none";
    document.getElementById("interface-" + bug_or_failure + "-" + option + "-label").style.color = choice === option ? "black" : "lightgray";
    if (bug_or_failure === "failure") {
      current_failure_option = choice;
    }
    update_failure_position(0, false, false);
  }
};

let failure_playing = false;
const update_failure_playing = function(new_failure_playing) {
  failure_playing = new_failure_playing;
  document.getElementById("interface-failure-play-pause-span").innerHTML = failure_playing ? "&#10074;&#10074;" : "&#9658;";
};

document.addEventListener("DOMContentLoaded", function() {
  for (let bug_or_failure in interface_bug_failure_options) {
    if (Object.prototype.hasOwnProperty.call(interface_bug_failure_options, bug_or_failure)) {
      for (let option of interface_bug_failure_options[bug_or_failure]) {
        let radio_button = document.getElementById("interface-" + bug_or_failure + "-" + option +  "-option");
        radio_button.addEventListener("change", (function(bug_or_failure, option, radio_button) {
          return function() {
            if (radio_button.checked) {
              update_interface_bug_failure_option(bug_or_failure, option);
            }
          };
        })(bug_or_failure, option, radio_button));
        if (bug_or_failure === "failure") {
          append_all_failure_descriptions(option);
        }
        fix_failure_description_height();
      }
    }
  }
  document.getElementById("bug-saw-link").addEventListener("click", function(){
    document.getElementById("interface-bug-saw-option").checked = true;
    update_interface_bug_failure_option("bug", "saw");
    interfaces["bug_saw"].$set({
      "video_state": {"position": 2, "velocity_direction": 0},
    });
  });
  update_failure_position(0, false, false);
  update_failure_playing(true);
  window.setInterval(function() {
    if (failure_playing) {
      update_failure_position(1, false, true);
    }
  }, 1000);
  document.getElementById("interface-failure-play-pause-button").addEventListener("click", function() {
    update_failure_playing(!failure_playing);
  });
  document.getElementById("interface-failure-start").addEventListener("click", function() {
    update_failure_position(0, true, false);
    update_failure_playing(false);
  });
  document.getElementById("interface-failure-previous").addEventListener("click", function() {
    update_failure_position(-1, false, false);
    update_failure_playing(false);
  });
  document.getElementById("interface-failure-next").addEventListener("click", function() {
    update_failure_position(1, false, false);
    update_failure_playing(false);
  });
  document.getElementById("interface-failure-end").addEventListener("click", function() {
    update_failure_position(-1, true, false);
    update_failure_playing(false);
  });
});

let model_editing_videos_playing = {};
let model_editing_some_video_playing = function(level_number) {
  for (let video_number = 1; video_number < 4; video_number++) {
    if (model_editing_videos_playing[level_number][video_number]) {
      return true;
    }
  }
  return false;
};
let update_model_editing_play_pause_button = function(level_number) {
  document.getElementById("model-editing-level-" + level_number.toString() + "-play-pause-span").innerHTML = model_editing_some_video_playing(level_number) ? "&#10074;&#10074;" : "&#9658;";
};

document.addEventListener("DOMContentLoaded", function() {
  for (let level_number_option = 1; level_number_option < 4; level_number_option++) {
    let radio_button = document.getElementById("model-editing-level-" + level_number_option.toString() + "-option");
    radio_button.addEventListener("click", (function(level_number_option, radio_button) {
      return function() {
        if (radio_button.checked) {
          for (let level_number_target = 1; level_number_target < 4; level_number_target++) {
            let label = document.getElementById("model-editing-level-" + level_number_target.toString() + "-label");
            let play_pause_button = document.getElementById("model-editing-level-" + level_number_target.toString() + "-play-pause-button");
            if (level_number_target === level_number_option) {
              label.style.color = "black";
              play_pause_button.style.display = "block";
            }
            else {
              label.style.color = "lightgray";
              play_pause_button.style.display = "none";
            }
            for (let target_number = 1; target_number < 4; target_number++) {
              let target = document.getElementById("model-editing-level-" + level_number_target.toString() + "-target-" + target_number.toString());
              if (level_number_target === level_number_option) {
                target.style.display = "block";
              }
              else {
                target.style.display = "none";
              }
            }
          }
        }
      };
    })(level_number_option, radio_button));
  }
  for (let level_number = 1; level_number < 4; level_number++) {
    model_editing_videos_playing[level_number] = {};
    for (let video_number = 1; video_number < 4; video_number++) {
      let video = document.getElementById("model-editing-level-" + level_number.toString() + "-video-" + video_number.toString());
      video.play();
      let update_video_playing = (function(level_number, video_number, video) {
        return function() {
          model_editing_videos_playing[level_number][video_number] = !video.paused;
          update_model_editing_play_pause_button(level_number);
        };
      }(level_number, video_number, video));
      update_video_playing();
      video.addEventListener("play", update_video_playing);
      video.addEventListener("pause", update_video_playing);
      video.addEventListener("ended", update_video_playing);
    }
    document.getElementById("model-editing-level-" + level_number.toString() + "-play-pause-button").addEventListener("click", (function(level_number) {
      return function() {
        let some_video_playing = model_editing_some_video_playing(level_number);
        for (let video_number = 1; video_number < 4; video_number++) {
          let video = document.getElementById("model-editing-level-" + level_number.toString() + "-video-" + video_number.toString());
          if (some_video_playing) {
            video.pause();
          }
          else {
            video.play();
          }
        }
        update_model_editing_play_pause_button(level_number);
      };
    })(level_number));
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementsByClassName("velocity-info-footnote")[0].shadowRoot.styleSheets[0].insertRule('d-hover-box{left:-42em;}');
});
