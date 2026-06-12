document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home').addEventListener('click', (event) => {
    load_main();
  })
  document.getElementById('test').addEventListener('click', (event) => {
    console.log("testy pressed");
    const reqpayload = {
      method: "POST"
    };
    fetch('/dothing', reqpayload);
  })
  document.getElementById('test2').addEventListener('click', (event) => {
    console.log("test pressed");
    const reqpayload = {
      method: "POST"
    };
    fetch('/dothingtoo',reqpayload);
  })
});

function load_main(){
  // history.pushstate();
  // window.localstorage();
  main_body = document.getElementById("main_body");
  main_body.innerHTML = `
    <h1>in the works</h1>
      <button id="test">testy</button>
      <button id="test2">testy2</button>
  `;
}
