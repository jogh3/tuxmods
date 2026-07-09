function load_main(is_pop_state = false){
  console.log("changing to home");
  if (!is_pop_state) { // if the page is new and not loaded from a movement button add to the history
    // WE STORE THE STATE HERE! We save { page: "home" }
    history.pushState({ page: "home" }, "", "/");
  }
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1>in the works</h1>
      <button id="test">testy</button>
      <button id="test2">testy2</button>
      <button id="gettest">gettest</button>
  `;
  return;
}
function load_settings(is_pop_state = false) {
  console.log("changing to settings");
  if (!is_pop_state) {
    history.pushState({ page: "settings" }, "", "/settings");
  }
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1> settings page, fucking hell this is long</h1>
      <p>poopy</p>
  `;
  return;
}
async function fetch_mod_list(target_game){
  const params = new URLSearchParams({ // generate the api request parameters
    game: target_game
  });
  console.log("sending, ", params.toString());
  const api_url = `/api/get_mod_list?${params.toString()}`;
  try {
    const response = await fetch(api_url);
    const data = await response.json();
    
    console.log('got back: ', data);
    return data;

  } catch (error) {
    console.log("error fetching list: ", error);
    return null;
  }
}
function build_mod_list_html(mod_data) {
  let final_html = '';
  for (const mod_key in mod_data) { // forms the mod info into a list
    const mod_info = mod_data[mod_key];
    let button_text = mod_info.enabled ? "disable" : "enable";
    if (!mod_info.exists) {
      button_text = "removed";
      mod_info.load_index = -1;
    }
    let proper_mod_key = mod_key.replace(/_/g," "); // replaces the "_" with spaces, probaly should undo, depending on later
    final_html += `
      <li class="mod-row">
        <span class="mod-name">${proper_mod_key}</span>
        <div class="mod-spacer"></div>
        <button class="toggle-btn" id="toggle_${mod_key}">${button_text}</button>
      </li>
    `;
     // <span class="mod-index">load order: ${mod_info.load_index}</span>
  }
  
  return final_html;
}

async function load_mod_list(is_pop_state = false, is_refresh = false) {
  console.log("changing to mod list");
  // loads the header of the mod list, incase the fetch takes a while so user knows it is trying to load
  let main_body = document.getElementById("main_body");
  const header_html = `
    <h1> mod list </h1>
  `;
  if (!is_refresh){ // this is here for when you load the page from the sidebar
    main_body.innerHTML = header_html;
  }
  if (!is_pop_state) {
    history.pushState({ page: "mod_list" }, "", "/mod_list");
  }
  let mod_list = await fetch_mod_list(game_to_mod);
  if (!mod_list) {
    console.log("no mods returned");
    main_body.innerHTML += `<h2> no mods returned </h2>`;
    return;
  }
  let formatted_mods = build_mod_list_html(mod_list);
  if (is_refresh){ // this is for when the page is refreshed from enabling/disabling to get rid of any flicker
    main_body.innerHTML = header_html;
  }
  main_body.innerHTML += `
    <ul>
      ${formatted_mods}
    </ul>
  `;
}

function load_load_order(is_pop_state = false) {
  console.log("changing to load order");
  let main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1> load order </h1>
  `;
  if (!is_pop_state){
    history.pushState({page: "load_order"}, "", "/load_order");
  }
}
