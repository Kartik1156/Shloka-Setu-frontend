document.addEventListener("DOMContentLoaded", function () {
  //  Music control
  const playBtn = document.getElementById("i");
  const music = document.getElementById("bgMusic");
  let isPlaying = false;

  if (playBtn && music) {
    music.volume = 0.3;
    playBtn.addEventListener("click", () => {
      if (!isPlaying) {
        music.play().then(() => {
          isPlaying = true;
        }).catch((err) => {
          console.error("Music play failed:", err);
        });
      } else {
        music.pause();
        isPlaying = false;
      }
    });
  }

  //  Preloader 
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 2000);
  }

  //  Chatbot 
  const inputField = document.getElementById("input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");

  function createMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    
    const paragraphs = text.split('\n\n');
    paragraphs.forEach(paragraphText => {
      const messageContent = document.createElement("p");
      messageContent.innerHTML = paragraphText.replace(/\n/g, '<br>');
      messageDiv.appendChild(messageContent);
    });
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
  }

  async function getShlokaFromBackend(input) {
    const loadingMessage = createMessage("Finding wisdom...", "bot-message");
    loadingMessage.classList.add("loading");

    try {
      const res = await fetch("https://shloka-setu-backend.onrender.com/shloka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input })
      });

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      loadingMessage.remove();

      if (reply) {
        createMessage(reply, "bot-message");
      } else {
        createMessage("🙏 Sorry, no response received.", "bot-message");
      }
    } catch (error) {
      console.error("Backend API error:", error);
      loadingMessage.remove();
      createMessage("⚠️ Error fetching shloka. Please check backend.", "bot-message");
    }
  }

  function handleSendMessage() {
    const userInput = inputField.value.trim();
    if (userInput) {
      createMessage(userInput, "user-message");
      inputField.value = "";
      getShlokaFromBackend(userInput);
    }
  }

  sendBtn.addEventListener("click", handleSendMessage);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  });
});





