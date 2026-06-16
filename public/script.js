document.addEventListener('DOMContentLoaded', () => {
  const sidebar_buttons = {
    "home": load_main,
    "settings": load_settings
  }
  console.log(window.location.pathname);
  const raw_path = window.location.pathname;
  let start_page = raw_path === "/" ? "home" : raw_path.slice(1);
  start_page = sidebar_buttons[start_page];
  if (start_page){ 
    start_page();
  } else {
    console.log("invalid path");
    load_main();
  }
  document.getElementById("sidebar").addEventListener('click', (event) => {
    let button_press = sidebar_buttons[event.target.id];
    if (button_press) button_press();
  })
  document.getElementById("main_body").addEventListener('click', (event) => {
    switch (event.target.id) {
      case "test":
        console.log("testy pressed");
        send_payload("POST",'/dothing');
        break;
      case "test2":
        console.log("test pressed");
        send_payload("POST",'/dothingtoo');
      case "gettest":
        console.log('gettest pressed');
        send_payload("GET",'/api/getest');
        break;
      default:
        break;
    }
  })
});

function send_payload(inmethod, url){
  const reqpayload = {
    method: inmethod
  };
  fetch(url,reqpayload);
  return;
}

function load_main(){
  console.log("changing to home");
  history.pushState(null,"","/");
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1>in the works</h1>
      <button id="test">testy</button>
      <button id="test2">testy2</button>
      <button id="gettest">gettest</button>
  `;
  return;
}
function load_settings() {
  console.log("changing to settings");
  history.pushState(null,"","/settings");
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1> settings page, fucking hell this is long</h1>
      <p>poopy</p>
  `;
  return;
}
