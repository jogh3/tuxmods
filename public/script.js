document.addEventListener('DOMContentLoaded', () => {
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
