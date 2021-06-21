var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var closeTransition = function (rootElement) {
    rootElement.style.maxHeight = "0px";
    rootElement.style.padding = "0px 0px";
    rootElement.style.zIndex = "-4";
};
var openTransition = function (item) {
    item.style.opacity = "1";
};
var openBox = function (e) {
    var items = e.target.parentElement.parentElement
        .getElementsByClassName("content-box")[0]
        .querySelectorAll(".item");
    var rootElement = e.target.parentElement.parentElement.getElementsByClassName("content-box")[0];
    rootElement.removeEventListener("transitionend", openTransition);
    items.forEach(function (item) {
        item.style.opacity = item.style.opacity = "0";
        item.addEventListener("transitionend", closeTransition(rootElement));
    });
    e.target.removeEventListener("click", openBox);
    e.target.addEventListener("click", closeBox);
};
var closeBox = function (e) {
    var items = e.target.parentElement.parentElement
        .getElementsByClassName("content-box")[0]
        .querySelectorAll(".item");
    var rootElement = e.target.parentElement.parentElement.getElementsByClassName("content-box")[0];
    rootElement.style.zIndex = 3;
    rootElement.style.maxHeight = "600px";
    rootElement.style.padding = "20px 0px";
    items.forEach(function (item) {
        item.removeEventListener("transitionend", closeTransition);
        rootElement.addEventListener("transitionend", openTransition(item));
    });
    e.target.removeEventListener("click", closeBox);
    e.target.addEventListener("click", openBox);
};
var deleteFromList = function (e, id, root) {
    var item_id = parseInt(id);
    var list = JSON.parse(document.cookie.toString().split("=")[1]);
    var newList = list.filter(function (item) { return item.id !== item_id; });
    document.cookie = "list=" + JSON.stringify(newList) + ";expires=Thu, 18 Dec 3999 12:00:00 UTC";
    e.target.parentElement.remove();
    if (root.getElementsByClassName("item").length === 0) {
        root.remove();
        if (document.getElementsByClassName("rootElement").length === 0) {
            document.getElementById("no-products").style.display = "flex";
        }
    }
};
var LoadData = function () {
    if (document.cookie === "" || document.cookie.length === 7) {
        document.getElementById("no-products").style.display = "flex";
        if (document.getElementById("list") !== null) {
            document.getElementById("list").innerHTML = "";
        }
    }
    else {
        document.getElementById("no-products").style.display = "none";
        if (document.getElementById("list") !== null) {
            document.getElementById("list").innerHTML = "";
        }
        var categories_1 = [];
        var list_1 = JSON.parse(document.cookie.toString().split("=")[1]);
        list_1.forEach(function (element) {
            if (categories_1.indexOf(element.category) === -1) {
                categories_1.push(element.category);
            }
        });
        categories_1.forEach(function (category) {
            //create root element
            var rootElement = document.createElement("div");
            rootElement.setAttribute("class", "rootElement");
            //create category name div
            var categoryElement = document.createElement("div");
            categoryElement.setAttribute("class", "category");
            categoryElement.innerHTML = "<p>" + category + "</p>";
            var button = document.createElement("button");
            button.innerText = "+";
            button.addEventListener("click", closeBox);
            categoryElement.appendChild(button);
            //create box for items in list
            var boxForElements = document.createElement("div");
            boxForElements.setAttribute("class", "content-box");
            rootElement.appendChild(categoryElement);
            list_1.forEach(function (element) {
                if (element.category === category) {
                    var item = document.createElement("div");
                    item.setAttribute("class", "item");
                    item.innerHTML = "<h2>" + element.name + "</h2><h2>Amount:" + element.amount + "</h2><p>" + element.description + "</p>";
                    var button_1 = document.createElement("button");
                    button_1.innerText = "DELETE";
                    button_1.addEventListener("click", function (e) {
                        return deleteFromList(e, element.id, rootElement);
                    });
                    item.appendChild(button_1);
                    boxForElements.appendChild(item);
                }
            });
            rootElement.appendChild(boxForElements);
            document.getElementById("list").appendChild(rootElement);
        });
    }
};
LoadData();
var isVisable = false;
//add section fadeIn and Out animation
document.getElementById("close").addEventListener("click", function () {
    document.getElementById("add-menu").style.animation =
        "fadeOut 0.3s ease-in-out";
    isVisable = false;
});
document.getElementById("add").addEventListener("click", function () {
    document.getElementById("search-bar").value = "";
    search();
    document.getElementById("add-menu").style.display = "flex";
    document.getElementById("add-menu").style.animation =
        "fadeIn 0.3s ease-in-out";
    isVisable = true;
});
document.getElementById("add-menu").addEventListener("animationend", function () {
    if (isVisable) {
        document.getElementById("add-menu").style.display = "flex";
    }
    else {
        document.getElementById("add-menu").style.display = "none";
    }
});
//adding product to list
document.getElementById("add-to-list").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementsByName("Name")[0].value.toString();
    var amount = parseFloat(document.getElementsByName("Amount")[0].value);
    var description = document.getElementsByName("Description")[0].value.toString();
    var category = document.getElementsByName("Category")[0].value.toString();
    if (name.length > 0) {
        if (description.length <= 50) {
            document.getElementsByName("Name")[0].style.border = "0px";
            var newToList = {
                name: name,
                amount: amount > 0 ? amount : 1,
                category: category,
                description: description.length > 0 ? description : "",
                id: Math.floor(Math.random() * 99999)
            };
            var allInList = document.cookie;
            if (allInList === "") {
                var newArrayList = [newToList];
                document.cookie = "list=" + JSON.stringify(newArrayList) + ";expires=Thu, 18 Dec 3999 12:00:00 UTC";
            }
            else {
                var OldList = JSON.parse(document.cookie.toString().split("=")[1]);
                var newTaskList = __spreadArray(__spreadArray([], OldList), [newToList]);
                document.cookie = "list=" + JSON.stringify(newTaskList) + ";expires=Thu, 18 Dec 3999 12:00:00 UTC";
            }
            document.getElementsByName("Description")[0].value =
                "";
            document.getElementsByName("Name")[0].value = "";
            document.getElementsByName("Amount")[0].value = "";
            document.getElementsByName("Category")[0].value =
                "Food";
            document.getElementById("add-menu").style.animation =
                "fadeOut 0.3s ease-in-out";
            isVisable = false;
            LoadData();
        }
    }
    else {
        document.getElementsByName("Name")[0].style.border = "1px solid red";
    }
});
//delete when searching
var deleteWhenSearch = function (id, e) {
    var parent = e.target.parentElement;
    var list = JSON.parse(document.cookie.toString().split("=")[1]);
    var newList = list.filter(function (item) { return item.id !== id; });
    document.cookie = "list=" + JSON.stringify(newList) + ";expires=Thu, 18 Dec 3999 12:00:00 UTC";
    parent.remove();
    search();
};
//search
var search = function () {
    if (document.cookie === "" || document.cookie.length === 7) {
        document.getElementById("no-products").style.display = "flex";
        if (document.getElementById("list") !== null) {
            document.getElementById("list").innerHTML = "";
        }
    }
    else {
        document.getElementById("list").innerHTML = "";
        var value_1 = document.getElementById("search-bar").value.toString();
        if (value_1.length > 0) {
            var list = JSON.parse(document.cookie.toString().split("=")[1]);
            var matchedItems = list.filter(function (item) { return item.name.indexOf(value_1) !== -1; });
            if (matchedItems.length === 0) {
                document.getElementById("no-products").style.display = "flex";
            }
            else {
                var rootElement_1 = document.createElement("div");
                rootElement_1.setAttribute("id", "search-result");
                matchedItems.forEach(function (element) {
                    var item = document.createElement("div");
                    item.setAttribute("class", "item");
                    item.innerHTML = "<h2>" + element.name + "</h2><h2>Amount:" + element.amount + "</h2><p>" + element.description + "</p>";
                    var button = document.createElement("button");
                    button.innerText = "DELETE";
                    button.addEventListener("click", function (e) {
                        return deleteWhenSearch(element.id, e);
                    });
                    item.appendChild(button);
                    rootElement_1.appendChild(item);
                });
                document.getElementById("list").appendChild(rootElement_1);
            }
        }
        else {
            LoadData();
        }
    }
};
document.getElementById("search-bar").addEventListener("input", search);
