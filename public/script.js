document.addEventListener('DOMContentLoaded', () => {
  // all the sidebar buttons, and their associated functions
  const sidebar_buttons = {
    "home": load_main,
    "settings": load_settings,
    "mod_list": load_mod_list,
    "load_order": load_load_order
  }
  console.log(window.location.pathname);
  const raw_path = window.location.pathname;
  let start_page = raw_path === "/" ? "home" : raw_path.slice(1); // defaults to home if it is just slash, otherwise removes the starting /
  start_page = sidebar_buttons[start_page];
  if (start_page){
    start_page(true);
  } else {
    console.log("invalid path");
    load_main(true);
  }  

  // checks if the load is from pressing a back or forward button in the browser
  window.addEventListener('popstate', (event) => {
    const page_to_load = event.state && event.state.page ? event.state.page : 'home';
    
    console.log("Browser navigation detected. Loading:", page_to_load);
    
    if (sidebar_buttons[page_to_load]) { // chcks if page is valid
      sidebar_buttons[page_to_load](true); 
    }
  });

  document.getElementById("sidebar").addEventListener('click', (event) => { // default check to load button if sidebar is pressed
    let button_press = sidebar_buttons[event.target.id];
    if (button_press) button_press(false);
  })
  // api calls for the main_body, not permanent
  document.getElementById("main_body").addEventListener('click', (event) => {
    switch (event.target.id) {
      case "test":{
        console.log("testy pressed");
        send_payload("POST",'/api/dothing');
        break;
      }
      case "test2":{
        console.log("test pressed");
        send_payload("POST",'/api/dothingtoo');
        break;  
      }
      case "gettest":{
        console.log('gettest pressed');
        send_payload("GET",'/api/getest');
        break;
      }
      default:{
        break;
      }
    }
  })
});

// temp send payload function
function send_payload(inmethod, url){
  const reqpayload = {
    method: inmethod
  };
  fetch(url,reqpayload);
  return;
}

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
async function load_mod_list(is_pop_state = false) {
  console.log("changing to mod list");
  // loads the header of the mod list, incase the fetch takes a while so user knows it is trying to load
  let main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1> mod list </h1>
  `;
  if (!is_pop_state) {
    history.pushState({ page: "mod_list" }, "", "/mod_list");
  }
  let mod_list = await fetch_mod_list("skyrim");
  if (!mod_list) {
    console.log("no mods returned");
    main_body.innerHTML += `<h2> no mods returned </h2>`;
    return;
  }
  let formatted_mods = build_mod_list_html(mod_list);
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
