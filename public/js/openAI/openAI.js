function addLine(writer, msg){                          /* html 코드를 생성합니다. */
    const ul = document.createElement('ul');
          ul.className = `msgbox ${writer}`
    const div = document.createElement('div');
    const p = document.createElement('p');
          p.innerHTML = `${msg}`;

    div.appendChild(p);
    ul.appendChild(div);

    document.getElementById('items').appendChild(ul);
}

function askBot(){                                      /* 전송 클릭시 실행될 함수 입니다. */
    const msgbox = document.getElementById('msgbox');
    const msg = msgbox.value;
    msgbox.value = '';
    msgbox.focus();

    addLine('me',msg);
    send(msg);
}
 
async function send(msg){                    
    const csrfToken = document.getElementById('csrfToken').value /* 미들웨어에서 생성한 내용을 호출합니다. */
    try {
        const response = await fetch("../ai/chat",{
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                'X-CSRF-TOKEN': csrfToken  // CSRF 토큰 헤더에 추가
            },
            body : JSON.stringify({"prompt": msg}),
        });

        const prediction = await response.json();   
        addLine('bot', prediction.response.content);
    } catch(error){
        console.error("send() Error!!");
    } finally{

    }
}

document.getElementById('sendBtn').addEventListener('click',function(){
    askBot();
  });

document.getElementById('msgbox').addEventListener('keyup',function(e){
    if(e.key==='Enter'){
        askBot();
    }
 });