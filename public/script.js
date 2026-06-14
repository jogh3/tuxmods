document.addEventListener('DOMContentLoaded', () => {
  switch (window.location.pathname) {
    case "/":
      load_main();
      break;
    case "/settings":
      load_settings();
      break;
    default:
      break;
  }
  document.getElementById("sidebar").addEventListener('click', (event) => {
    switch (event.target.id) {
      case "home":
        load_main();
        break;
      case "settings":
        load_settings();
        break;
      default:
        break;
    }
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
}

function load_main(){
  console.log("changing to home");
  history.pushState(null,"","/");
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1>in the works</h1>
      <button id="test">testy</button>
      <button id="test2">testy2</button>
  `;
}
function load_settings() {
  console.log("changing to settings");
  history.pushState(null,"","/settings");
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1> settings page, fucking hell this is long</h1>
      <p>poopy</p>
  `;
}
