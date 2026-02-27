(function () {
  var toggle = document.getElementById("chatToggle");
  var panel = document.getElementById("chatPanel");
  var close = document.getElementById("chatClose");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var messages = document.getElementById("chatMessages");
  var chips = document.querySelectorAll(".chat-chip");

  if (!toggle || !panel || !form || !input || !messages) {
    return;
  }

  var pdsUrl =
    "https://edge.sitecorecloud.io/eqtservicesd49b-equity3a10-prod1271-d16d/media/equitytrustees/files/instofunds/future-trading-capital-pty-limited/ft-capital-multi-class-investment-fund-us-large-cap-enhanced-complex-class-pds.pdf";
  var tmdUrl = "https://swift.zeidlerlegalservices.com/tmds/ETL9337AU";

  var intents = [
    {
      keywords: ["pds", "product disclosure", "disclosure statement"],
      answer:
        'You can open the Product Disclosure Statement here: <a href="' +
        pdsUrl +
        '" target="_blank" rel="noopener">PDS document</a>.',
      html: true,
    },
    {
      keywords: ["tmd", "target market", "determination"],
      answer:
        'The Target Market Determination is here: <a href="' +
        tmdUrl +
        '" target="_blank" rel="noopener">Open TMD</a>.',
      html: true,
    },
    {
      keywords: ["inception", "start date", "commenced"],
      answer: "The inception date is February 23 2026.",
      html: false,
    },
    {
      keywords: ["custodian", "who holds", "asset custody"],
      answer: "The custodian is Apex Fund Services Pty Ltd.",
      html: false,
    },
    {
      keywords: ["management fee", "management cost", "fee"],
      answer: "The management fee is 0.75% p.a.",
      html: false,
    },
    {
      keywords: ["performance fee", "incentive fee", "carry"],
      answer: "The performance fee is 25%.",
      html: false,
    },
    {
      keywords: ["benchmark", "index", "s&p"],
      answer:
        "The benchmark is E-mini S&P 500 Stock Price Index Futures Lead Month Contract (March 2026).",
      html: false,
    },
    {
      keywords: ["objective", "goal", "target return"],
      answer:
        "The objective is to outperform the benchmark after management fees, costs, and performance fee.",
      html: false,
    },
    {
      keywords: ["strategy", "approach", "futures", "options"],
      answer:
        "The strategy uses active management with exchange traded futures and options overlays.",
      html: false,
    },
    {
      keywords: ["risk", "volatility", "drawdown"],
      answer: "The risk level is High.",
      html: false,
    },
    {
      keywords: ["apir", "arsn", "code"],
      answer: "APIR is ETL9337AU and ARSN is 652 933 616.",
      html: false,
    },
    {
      keywords: ["contact", "email", "phone", "call"],
      answer:
        "You can contact FT Capital at +61 2 8051 3124 or ask@ftcapital.com.au.",
      html: false,
    },
  ];

  function addMessage(role, text, asHtml) {
    var row = document.createElement("div");
    row.className = "chat-message " + role;

    if (asHtml) {
      row.innerHTML = text;
    } else {
      row.textContent = text;
    }

    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function scoreIntent(query, intent) {
    var score = 0;
    for (var i = 0; i < intent.keywords.length; i += 1) {
      if (query.indexOf(intent.keywords[i]) !== -1) {
        score += 1;
      }
    }
    return score;
  }

  function findAnswer(query) {
    var text = normalize(query);

    if (!text) {
      return {
        answer: "Please enter a question so I can help.",
        html: false,
      };
    }

    if (/^(hi|hello|hey|good morning|good afternoon)/.test(text)) {
      return {
        answer:
          "Hello. You can ask about fees, inception date, benchmark, custodian, documents, and contact details.",
        html: false,
      };
    }

    var best = null;
    var bestScore = 0;

    for (var i = 0; i < intents.length; i += 1) {
      var current = intents[i];
      var currentScore = scoreIntent(text, current);

      if (currentScore > bestScore) {
        bestScore = currentScore;
        best = current;
      }
    }

    if (best && bestScore > 0) {
      return best;
    }

    return {
      answer:
        "I do not have that answer yet. Try asking about management fee, inception date, benchmark, PDS, TMD, or custodian.",
      html: false,
    };
  }

  function replyTo(query) {
    addMessage("user", query, false);
    input.value = "";

    var typing = document.createElement("div");
    typing.className = "chat-message bot";
    typing.textContent = "Typing...";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(function () {
      messages.removeChild(typing);
      var result = findAnswer(query);
      addMessage("bot", result.answer, result.html);
    }, 350);
  }

  function openChat() {
    panel.hidden = false;
    panel.style.display = "flex";
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    panel.style.display = "none";
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    if (panel.hidden) {
      openChat();
    } else {
      closeChat();
    }
  });

  if (close) {
    close.addEventListener("click", function (event) {
      event.preventDefault();
      closeChat();
    });
  }

  panel.addEventListener("click", function (event) {
    if (event.target === panel) {
      closeChat();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      closeChat();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = input.value.trim();

    if (!query) {
      input.focus();
      return;
    }

    replyTo(query);
  });

  for (var c = 0; c < chips.length; c += 1) {
    chips[c].addEventListener("click", function (event) {
      var button = event.currentTarget;
      var query = button.getAttribute("data-query");

      if (!query) {
        return;
      }

      if (panel.hidden) {
        openChat();
      }

      replyTo(query);
    });
  }

  addMessage(
    "bot",
    "Welcome to FT Capital Chatkit. Ask me about fees, documents, benchmark, inception date, or custodian.",
    false
  );

  closeChat();
})();
