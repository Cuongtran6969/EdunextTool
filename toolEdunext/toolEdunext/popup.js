const autoGroupStar = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getFullStar
    });
};

const getFullStar = () => {
    // const groupmateBox = document.querySelectorAll('.sidebar-block')
    // const groupmateBtn = groupmateBox[1].getElementsByTagName('button')[0]
    const radioButtons = document.querySelectorAll('input.MuiRating-visuallyHidden');
    // groupmateBtn.click()
    radioButtons.forEach(itemLabel => {
        if (itemLabel.value >= 1 && itemLabel.value <= 5) {
            itemLabel.click()
        }
    });
    var applyStar = document.querySelectorAll('.MuiButtonBase-root')
    applyStar[applyStar.length - 1].click()

}
const autoPersonStar = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getPersonMark
    });
};
const getPersonMark = () => {
    const listVote = document.querySelectorAll('span.vote-cmt')
    function getMark(id) {
        const listBoxButton = document.querySelectorAll('.MuiButtonGroup-text')
        const listButtonMark = listBoxButton[id].getElementsByTagName('button')
        console.log(listButtonMark[0]);
        if (id == 0 || id == 1) {
            listButtonMark[0].click()
        } else if (id == 2 || id == 3) {
            listButtonMark[1].click()
        } else if (id == 4 || id == 5) {
            listButtonMark[2].click()
        } else {
            listButtonMark[3].click()
        }
    }
    // Thiết lập chu kỳ thời gian là 5 giây
    let index = 0;
    function dispatchMouseEvent(element) {
        element.dispatchEvent(
            new MouseEvent('mouseover', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            })
        );
        console.log(`mark in ${index}`)
    }
    let intervalId = setInterval(function () {
        if (index < listVote.length) {
            let liElement = listVote[index];
            dispatchMouseEvent(liElement)
            getMark(index);
        } else {
            clearInterval(intervalId);
        }
        index++;
    }, 300);
}

const autoSubmit = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: submitComment
    });
}

const submitComment = () => {
    var iframe = document.querySelectorAll(".tox-edit-area iframe")[0];
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var pTag = innerDoc.getElementsByTagName("p")[0];
    const listComment = document.querySelectorAll('.comment.parent-comment')
    if(listComment.length > 0) {
        let numberRandom = Math.floor(Math.random() * (listComment.length - 1));
        let contentComment = listComment[numberRandom].querySelector('span[title="undefined"]').innerHTML;
        if (contentComment.length > 750) {
            contentComment = contentComment.slice(0, 750)
        }
        const lastIndexPoint = contentComment.lastIndexOf(".")
        if (lastIndexPoint != -1) {
            contentComment = contentComment.slice(0, lastIndexPoint + 1)
        }
        pTag.innerHTML = contentComment
    }
    const sendCommentBtn = document.querySelectorAll('.button-send-comment button')
    sendCommentBtn[0].click()
}

const autoAllAction = () => {
    autoGroupStar();
    autoPersonStar();
    autoSubmit()
}
const checkAction = () => {
    const listAction = document.querySelectorAll('.auto_action')
    listAction.forEach((action) => {
        action.addEventListener('click', () => {
            let nameAction = action.dataset.action;
            switch (nameAction) {
                case "auto_action-groupStar":
                    autoGroupStar();
                    break;
                case "auto_action-PersonMark":
                    autoPersonStar()
                    break;
                case "auto_action-autoSubmit":
                    autoSubmit()
                    break;
                case "auto_action-all":
                    autoAllAction()
                    break;
            }
        })
    })
}
checkAction()

// Gửi một yêu cầu POST đến ChatGPT API
async function sendQuestion(question) {
    const apiKey = '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';
    const url = 'https://api.openai.com/v1/chat/completions';
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo',
        'messages': [{'role': 'system', 'content': 'You are a user'}, {'role': 'user', 'content': question}]
      })
    });
  
    const data = await response.json();
    const answer = data.choices[0].message.content;
  
    // Xử lý câu trả lời ở đây
    const displayAnswer = document.getElementById('output')
    displayAnswer.innerHTML = answer
  }
  
  const getAnswer = () => {
    const inputValue = document.getElementById('inputBox').value
    sendQuestion(inputValue)
  }
const changeTheme = () => {
    const changeBtn = document.querySelector('.change_btn')
    const box = document.querySelector('.box')
    changeBtn.addEventListener('click', ()=> {
        let iconBtn = changeBtn.querySelector('.btn_icon')
        let iconName = iconBtn.className.split(' ')[1]
        console.log(iconName);
        if(iconBtn.classList.contains('fa-moon')) {
            iconBtn.classList.replace('fa-moon','fa-sun')
            box.style.backgroundImage = "url('/img/darkBg.jpg')";
        }else if(iconBtn.classList.contains('fa-sun')) {
            iconBtn.classList.replace(iconName, 'fa-moon')
            box.style.backgroundImage = "url('/img/boxBG.jpg')";
        }
  })
}
changeTheme()
