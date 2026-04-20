document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('test').addEventListener('click', (event) => {
    console.log("testy pressed");
    const reqpayload = {
      method: "POST"
    };
    fetch('/testpost', reqpayload);
  })
});
