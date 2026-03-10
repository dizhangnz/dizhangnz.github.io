document.addEventListener('DOMContentLoaded', function() {
  var fuse;
  var showButton = document.getElementById("search-button");
  var hideButton = document.getElementById("close-search-button");
  var wrapper = document.getElementById("search-wrapper");
  var modal = document.getElementById("search-modal");
  var input = document.getElementById("search-query");
  var output = document.getElementById("search-results");
  var first, last;
  var searchVisible = false;
  var indexed = false;
  var hasResults = false;

  if (showButton) {
    showButton.addEventListener("click", displaySearch);
  }
  if (hideButton) {
    hideButton.addEventListener("click", hideSearch);
  }
  if (wrapper) {
    wrapper.addEventListener("click", hideSearch);
  }
  if (modal) {
    modal.addEventListener("click", function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key == "/") {
      var active = document.activeElement;
      var tag = active.tagName;
      var isInputField = tag === "INPUT" || tag === "TEXTAREA" || active.isContentEditable;

      if (!searchVisible && !isInputField) {
        event.preventDefault();
        displaySearch();
      }
    }

    if (event.key == "Escape") {
      hideSearch();
    }

    if (event.key == "ArrowDown") {
      if (searchVisible && hasResults) {
        event.preventDefault();
        if (document.activeElement == input && first) {
          first.firstElementChild && first.firstElementChild.focus();
        } else if (document.activeElement == last && last) {
          last.firstElementChild && last.firstElementChild.focus();
        } else if (document.activeElement.parentElement && document.activeElement.parentElement.nextSibling) {
          var next = document.activeElement.parentElement.nextSibling.firstElementChild;
          next && next.focus();
        }
      }
    }

    if (event.key == "ArrowUp") {
      if (searchVisible && hasResults) {
        event.preventDefault();
        if (document.activeElement == input) {
          input.focus();
        } else if (document.activeElement == first && first) {
          input.focus();
        } else if (document.activeElement.parentElement && document.activeElement.parentElement.previousSibling) {
          var prev = document.activeElement.parentElement.previousSibling.firstElementChild;
          prev && prev.focus();
        }
      }
    }

    if (event.key == "Enter") {
      if (searchVisible && hasResults) {
        event.preventDefault();
        if (document.activeElement == input && first) {
          first.firstElementChild && first.firstElementChild.click();
        } else {
          document.activeElement.click();
        }
      }
    }
  });

  if (input) {
    input.addEventListener("keyup", function (event) {
      executeQuery(this.value);
    });
  }

  function displaySearch() {
    if (!indexed) {
      buildIndex();
    }
    if (!searchVisible) {
      document.body.style.overflow = "hidden";
      wrapper.classList.add("search-visible");
      input.focus();
      searchVisible = true;
    }
  }

  function hideSearch() {
    if (searchVisible) {
      document.body.style.overflow = "";
      wrapper.classList.remove("search-visible");
      if (input) input.value = "";
      if (output) output.innerHTML = "";
      if (document.activeElement) document.activeElement.blur();
      searchVisible = false;
    }
  }

  function fetchJSON(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
        }
      }
    };
    httpRequest.open("GET", path);
    httpRequest.send();
  }

  function buildIndex() {
    var baseURL = wrapper.getAttribute("data-url");
    if (baseURL.startsWith('/')) {
      baseURL = window.location.origin + baseURL;
    }
    baseURL = baseURL.replace(/\/?$/, "/");
    fetchJSON(baseURL + "index.json", function (data) {
      var options = {
        shouldSort: true,
        ignoreLocation: true,
        threshold: 0.0,
        includeMatches: true,
        keys: [
          { name: "title", weight: 0.8 },
          { name: "section", weight: 0.2 },
          { name: "summary", weight: 0.6 },
          { name: "content", weight: 0.4 },
        ],
      };
      fuse = new window.Fuse(data, options);
      indexed = true;
    });
  }

  function executeQuery(term) {
    if (!fuse) return;

    var results = fuse.search(term);
    var resultsHTML = "";
    var noResultsMsg = output.getAttribute('data-no-results') || 'No results found';

    if (results.length > 0) {
      results.forEach(function (value) {
        var html = value.item.summary;
        var div = document.createElement("div");
        div.innerHTML = html;
        value.item.summary = div.textContent || div.innerText || "";

        var title = value.item.title;
        var link = 'href="' + value.item.permalink + '"';

        resultsHTML +=
          '<li class="search-result-item">' +
            '<a class="search-result-link" ' + link + ' tabindex="0">' +
              '<div class="search-result-content">' +
                '<div class="search-result-title">' + title + '</div>' +
                '<div class="search-result-meta">' + value.item.section +
                  '<span class="search-result-separator">&middot;</span>' +
                  (value.item.date ? value.item.date : "") +
                '</div>' +
                '<div class="search-result-summary">' + value.item.summary + '</div>' +
              '</div>' +
              '<span class="search-result-arrow">&rarr;</span>' +
            '</a>' +
          '</li>';
      });
      hasResults = true;
    } else {
      resultsHTML = '<li class="search-no-results">' + noResultsMsg + '</li>';
      hasResults = false;
    }

    output.innerHTML = resultsHTML;

    first = output.firstChild;
    last = output.lastChild;
  }
});
