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
    mod_change(event);
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
function mod_change(event) {
  if(event.target.classList.contains('toggle-btn')) {
    const target_game = "skyrim" // <--------------------------------------------------- temp
    const button_id = event.target.id;
    const mod_name = button_id.replace('toggle_','')
    console.log(`toggleing ${mod_name}`);
    const btn_label = document.getElementById(button_id);
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
    console.log("sending, ", params.toString());
    const api_url = `/api/update_master?${params.toString()}`;
    send_payload('POST', api_url);
    return true;
  }
  return false;
}
