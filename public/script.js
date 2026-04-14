document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('test').addEventListener('click', (event) => {
    console.log("testy pressed");
    payload{
      method: "POST"
    }
    fetch('localhost:8080/testpost')
  })
});
