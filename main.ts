//function to close effect (required to use removeEventListener)
const closeTransition = (rootElement) => {
  rootElement.style.maxHeight = "0px";
  rootElement.style.padding = "0px 0px";
  rootElement.style.zIndex = "-4";
};

//function to open effect (required to use removeEventListener)
const openTransition = (item) => {
  item.style.opacity = "1";
};

//close category box
const openBox = (e): void => {
  const items = e.target.parentElement.parentElement
    .getElementsByClassName("content-box")[0]
    .querySelectorAll(".item");

  const rootElement =
    e.target.parentElement.parentElement.getElementsByClassName(
      "content-box"
    )[0];

  //animation for closing
  rootElement.removeEventListener("transitionend", openTransition);
  items.forEach((item) => {
    item.style.opacity = item.style.opacity = "0";
    item.addEventListener("transitionend", closeTransition(rootElement));
  });

  e.target.removeEventListener("click", openBox);
  e.target.addEventListener("click", closeBox);
};

//open category box
const closeBox = (e): void => {
  const items = e.target.parentElement.parentElement
    .getElementsByClassName("content-box")[0]
    .querySelectorAll(".item");

  const rootElement =
    e.target.parentElement.parentElement.getElementsByClassName(
      "content-box"
    )[0];

  //animation for open category box
  rootElement.style.zIndex = 3;
  rootElement.style.maxHeight = "600px";
  rootElement.style.padding = "20px 0px";

  items.forEach((item) => {
    item.removeEventListener("transitionend", closeTransition);

    rootElement.addEventListener("transitionend", openTransition(item));
  });

  e.target.removeEventListener("click", closeBox);
  e.target.addEventListener("click", openBox);
};

//delete item from main list (not from search bar)
const deleteFromList = (e, id, root) => {
  const item_id = parseInt(id);
  const list = JSON.parse(document.cookie.toString().split("=")[1]);
  const newList = list.filter((item) => item.id !== item_id);

  document.cookie = `list=${JSON.stringify(
    newList
  )};expires=Thu, 18 Dec 3999 12:00:00 UTC`;
  e.target.parentElement.remove();
  if (root.getElementsByClassName("item").length === 0) {
    root.remove();
    if (document.getElementsByClassName("rootElement").length === 0) {
      document.getElementById("no-products").style.display = "flex";
    }
  }
};

//loading first data and checking if there is some items to display
const LoadData = (): void => {
  if (document.cookie === "" || document.cookie.length === 7) {
    document.getElementById("no-products").style.display = "flex";
    if (document.getElementById("list") !== null) {
      document.getElementById("list").innerHTML = "";
    }
  } else {
    document.getElementById("no-products").style.display = "none";
    if (document.getElementById("list") !== null) {
      document.getElementById("list").innerHTML = "";
    }
    const categories = [];
    const list = JSON.parse(document.cookie.toString().split("=")[1]);
    list.forEach((element) => {
      if (categories.indexOf(element.category) === -1) {
        categories.push(element.category);
      }
    });

    categories.forEach((category) => {
      //create root element
      const rootElement = document.createElement("div");
      rootElement.setAttribute("class", "rootElement");

      //create category name div
      const categoryElement = document.createElement("div");
      categoryElement.setAttribute("class", "category");
      categoryElement.innerHTML = `<p>${category}</p>`;

      //create button to target showing elements
      const button = document.createElement("button");
      button.innerText = "+";
      button.addEventListener("click", closeBox);
      categoryElement.appendChild(button);

      //create box for items in list
      const boxForElements = document.createElement("div");
      boxForElements.setAttribute("class", "content-box");

      rootElement.appendChild(categoryElement);
      list.forEach((element) => {
        if (element.category === category) {
          //create item box
          const item = document.createElement("div");
          item.setAttribute("class", "item");
          //filling item box with description data
          item.innerHTML = `<h2>${element.name}</h2><h2>Amount:${element.amount}</h2><p>${element.description}</p>`;
          //creating button to delete item from list
          const button = document.createElement("button");
          button.innerText = "DELETE";
          button.addEventListener("click", (e) =>
            deleteFromList(e, element.id, rootElement)
          );
          item.appendChild(button);
          boxForElements.appendChild(item);
        }
      });
      rootElement.appendChild(boxForElements);
      document.getElementById("list").appendChild(rootElement);
    });
  }
};

//first data load
LoadData();

var isVisable = false;
//add section fadeIn and Out animation
document.getElementById("close").addEventListener("click", () => {
  document.getElementById("add-menu").style.animation =
    "fadeOut 0.3s ease-in-out";
  isVisable = false;
});

//handler to open add product menu
document.getElementById("add").addEventListener("click", () => {
  document.getElementById("error-msg").style.display="none";
  document.getElementsByName("Name")[0].style.border = "0px";
  (document.getElementById("search-bar") as HTMLInputElement).value = "";
  search();
  document.getElementById("add-menu").style.display = "flex";
  document.getElementById("add-menu").style.animation =
    "fadeIn 0.3s ease-in-out";
  isVisable = true;
});

//checking is menu add menu open
document.getElementById("add-menu").addEventListener("animationend", () => {
  if (isVisable) {
    document.getElementById("add-menu").style.display = "flex";
  } else {
    document.getElementById("add-menu").style.display = "none";
    (document.getElementsByName("Amount")[0] as HTMLInputElement).value="";
    (
      document.getElementsByName("Description")[0] as HTMLInputElement
    ).value="";
    (
      document.getElementsByName("Category")[0] as HTMLInputElement
    ).value="Food";
    (
      document.getElementsByName("Name")[0] as HTMLInputElement
    ).value=""
  }
});

//adding product to list
document.getElementById("add-to-list").addEventListener("submit", (e) => {
  e.preventDefault();
  const name: string = (
    document.getElementsByName("Name")[0] as HTMLInputElement
  ).value.toString();
  const amount: number = parseFloat(
    (document.getElementsByName("Amount")[0] as HTMLInputElement).value
  );
  const description: string = (
    document.getElementsByName("Description")[0] as HTMLInputElement
  ).value.toString();

  const category: string = (
    document.getElementsByName("Category")[0] as HTMLInputElement
  ).value.toString();

  if (name.length > 0 && name.length<=30) {
    document.getElementById("error-msg").style.display="none"
    if (description.length <= 50) {
      document.getElementsByName("Name")[0].style.border = "0px";
      //new item to list
      const newToList = {
        name,
        amount: amount > 0 ? amount : 1,
        category,
        description: description.length > 0 ? description : "",
        id: Math.floor(Math.random() * 99999),
      };

      //fill cookie with new item data
      const allInList = document.cookie;
      if (allInList === "") {
        const newArrayList: object[] = [newToList];
        document.cookie = `list=${JSON.stringify(
          newArrayList
        )};expires=Thu, 18 Dec 3999 12:00:00 UTC`;
      } else {
        const OldList = JSON.parse(document.cookie.toString().split("=")[1]);
        const newTaskList = [...OldList, newToList];
        document.cookie = `list=${JSON.stringify(
          newTaskList
        )};expires=Thu, 18 Dec 3999 12:00:00 UTC`;
      }
      (document.getElementsByName("Description")[0] as HTMLInputElement).value =
        "";
      (document.getElementsByName("Name")[0] as HTMLInputElement).value = "";
      (document.getElementsByName("Amount")[0] as HTMLInputElement).value = "";
      (document.getElementsByName("Category")[0] as HTMLInputElement).value =
        "Food";

      document.getElementById("add-menu").style.animation =
        "fadeOut 0.3s ease-in-out";
      isVisable = false;
      LoadData();
    }
  } else {
    document.getElementsByName("Name")[0].style.border = "1px solid red";
    document.getElementById("error-msg").style.display="block"
  }
});

//delete when searching
const deleteWhenSearch = (id, e) => {
  const parent = e.target.parentElement;

  const list = JSON.parse(document.cookie.toString().split("=")[1]);
  const newList = list.filter((item) => item.id !== id);

  document.cookie = `list=${JSON.stringify(
    newList
  )};expires=Thu, 18 Dec 3999 12:00:00 UTC`;

  parent.remove();
  search();
};

//search
const search = () => {
  if (document.cookie === "" || document.cookie.length === 7) {
    document.getElementById("no-products").style.display = "flex";
    if (document.getElementById("list") !== null) {
      document.getElementById("list").innerHTML = "";
    }
  } else {
    document.getElementById("list").innerHTML = "";
    const value = (
      document.getElementById("search-bar") as HTMLInputElement
    ).value.toString();
    if (value.length > 0) {
      const list = JSON.parse(document.cookie.toString().split("=")[1]);

      const matchedItems = list.filter(
        (item) => item.name.indexOf(value) !== -1
      );
      if (matchedItems.length === 0) {
        document.getElementById("no-products").style.display = "flex";
      } else {
        //rot element for list
        const rootElement = document.createElement("div");
        rootElement.setAttribute("id", "search-result");

        matchedItems.forEach((element) => {
          //item box
          const item = document.createElement("div");
          item.setAttribute("class", "item");
          item.innerHTML = `<h2>${element.name}</h2><h2>Amount:${element.amount}</h2><p>${element.description}</p>`;

          const button = document.createElement("button");
          button.innerText = "DELETE";
          button.addEventListener("click", (e) =>
            deleteWhenSearch(element.id, e)
          );

          item.appendChild(button);
          rootElement.appendChild(item);
        });

        document.getElementById("list").appendChild(rootElement);
      }
    } else {
      LoadData();
    }
  }
};

document.getElementById("search-bar").addEventListener("input", search);
