function home_api(event){
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
}
