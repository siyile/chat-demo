export async function fetchChatData(){
  const encodedURL = window.encodeURI("https://kangroo-557b2.firebaseio.com/fe-chat-test.json")
  const response = await fetch(encodedURL).catch(handelError);
  const data = await response.json();
  return data
}

const handelError = error => {console.warn(error); return null}

export function addUser(){
  return new Promise((res) => {})
}