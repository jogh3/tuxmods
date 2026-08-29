let game_to_mod =""; //"The Elder Scrolls V: Skyrim Special Edition";

async function get_current_game() {
  let returned_game = "";
  const api_url = `/api/get_current_game`;
  try {
      const response = await fetch(api_url);
      returned_game = await response.text();
      
      // text_data is now your string
    } catch (err) {
      console.error('error fetching string:', err);
    }
  return returned_game;
}

document.addEventListener('DOMContentLoaded', async () => {
  game_to_mod = await get_current_game();
  console.log("game to mod is:", game_to_mod);
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
    window.location.pathname = "/";
    load_main(true);
  }  

  // checks if the load is from pressing a back or forward button in the browser
  window.addEventListener('popstate', (event) => {
    const page_to_load = event.state && event.state.page ? event.state.page : 'home';
    
    console.log("navigation detected. Loading:", page_to_load);
    
    if (sidebar_buttons[page_to_load]) { // chcks if page is valid
      sidebar_buttons[page_to_load](true); 
    }
  });

  document.getElementById("sidebar").addEventListener('click', (event) => { // default check to load button if sidebar is pressed
    let button_press = sidebar_buttons[event.target.id];
    if (button_press) button_press(false);
  })
  // api calls for the main_body
  document.getElementById("main_body").addEventListener('click', (event) => {
    
    let cur_path = window.location.pathname;
    
    if (cur_path == "/" || cur_path == "home") {
      home_api(event);

    } else if (cur_path === "/mod_list"){ 

        console.log("checking if mod change");
        let enable_disable = mod_change(event);
        if (enable_disable) load_mod_list(false, true);
      }
  })
});

// temp send payload function
async function send_payload(inmethod, url){
  const reqpayload = {
    method: inmethod
  };
  const response = await fetch(url, reqpayload);
  const response_text = await response.text();
  return response_text === "true";
}

// calls the api to enable or disable mods
function mod_change(event) {
  if(event.target.classList.contains('toggle-btn')) { // check if it is actually the button that did this
    const target_game = game_to_mod;
    const button_id = event.target.id;
    const mod_name = button_id.replace('toggle_',''); // get the pur mod name
    console.log(`toggleing ${mod_name}`);
    const btn_label = document.getElementById(button_id).innerText;
    let btn_action = "";
    if ( btn_label === "enable"){
      btn_action = "enable_mod";
    } else if (btn_label === "disable") {
      btn_action = "disable_mod";
    } else if (btn_label === "removed") {
      console.log("mod doesn't exist");
      return false;
    }
    const params = new URLSearchParams({ // generate the api request parameters
      game: target_game,
      action: btn_action,
      mod: mod_name
    });
    document.getElementById(button_id).disabled = true;
    document.getElementById(button_id).innerText = "...";
    console.log("sending, ", params.toString());
    const api_url = `/api/update_master?${params.toString()}`;
    return send_payload('POST', api_url);
  }
  return false;
}
