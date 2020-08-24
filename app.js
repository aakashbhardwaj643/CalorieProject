// Storage Controller
const StorageCtrl = (function () {
  return {
    getItemsFromLocalStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    addItemsInLocalStorage: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromLocalStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    updateItemInLocalStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearLocalStorage: function () {
      localStorage.clear();
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromLocalStorage(),
    currentState: null,
    totalCalories: 0,
  };

  return {
    getData: function () {
      return data.items;
    },
    getCalories: function () {
      let total = 0;

      data.items.forEach(function (item) {
        total = total + item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemToEdit: function (id) {
      let found;

      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    setCurrentItem: function (item) {
      data.currentState = item;
    },
    getCurrentItem: function () {
      return data.currentState;
    },
    updateItem: function (name, calories) {
      let found;

      data.items.forEach(function (item) {
        if (item.id === data.currentState.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteSelectedItem: function (id) {
      const ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllListItems: function () {
      data.items = [];
      data.totalCalories = 0;
    },
    logData: function () {
      return data;
    },
    getDataFromInputFields: function (name, calories) {
      let ID;

      if (data.items.length > 0) {
        ID = data.items.length;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    clearBtn: ".clear-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    caloriesTotal: ".total-calories",
  };

  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a class="secondary-content" href="#"><i class="edit-item fa fa-pen"></i></a>
      </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getUISelectors: function () {
      return UISelectors;
    },
    getMealAndCalories: function () {
      return {
        mealName: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },
    showNewItem: function (newListItem) {
      // Display List Again
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Adding new meal to the list
      const newMeal = document.createElement("li");

      newMeal.id = `item-${newListItem.id}`;

      newMeal.className = "collection-item";

      newMeal.innerHTML = `<strong>${newListItem.name}: </strong> <em>${newListItem.calories} Calories</em>
      <a class="secondary-content" href="#"><i class="edit-item fa fa-pen"></i></a>`;

      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", newMeal);
    },
    updateListItem: function (item) {
      const lis = document.querySelectorAll(UISelectors.listItems);

      const lisArr = Array.from(lis);

      lisArr.forEach(function (li) {
        if (li.id === `item-${item.id}`) {
          li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a class="secondary-content" href="#"><i class="edit-item fa fa-pen"></i></a>`;
        }
      });
    },
    deleteItemFromUI: function (id) {
      document.querySelector(`#item-${id}`).remove();
      UICtrl.clearInputFields();
      if (!document.querySelector(UISelectors.itemList).firstElementChild) {
        UICtrl.hideList();
      }
    },
    clearInputFields: function () {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCalories).value = "";
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    clearEditState: function () {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    showItemInForm: function () {
      document.querySelector(
        UISelectors.itemName
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCalories
      ).value = ItemCtrl.getCurrentItem().calories;
    },
    displayTotalCalories: function (calories) {
      document.querySelector(
        UISelectors.caloriesTotal
      ).textContent = `${calories}`;
    },
    clearUIListItems: function () {
      document.querySelector(UISelectors.itemList).innerHTML = "";
      document.querySelector(UISelectors.caloriesTotal).textContent = "0";
      UICtrl.hideList();
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  // Get UI Selectors from UICtrl
  const UISelectors = UICtrl.getUISelectors();

  // Load Event Listeners
  const loadEventListeners = function () {
    // Disabling the enter key
    document.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Adding meal to the list
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", function (e) {
        const itemName = UICtrl.getMealAndCalories().mealName;
        const calories = UICtrl.getMealAndCalories().calories;
        if (itemName !== "" && calories !== "") {
          const newItem = ItemCtrl.getDataFromInputFields(itemName, calories);
          UICtrl.showNewItem(newItem);
          StorageCtrl.addItemsInLocalStorage(newItem);
        }

        // Get total calories from ItemCtrl
        const totalCalories = ItemCtrl.getCalories();
        UICtrl.displayTotalCalories(totalCalories);

        UICtrl.clearInputFields();

        e.preventDefault();
      });

    // Targeting Edit Button using event delegation
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", function (e) {
        if (e.target.classList.contains("edit-item")) {
          const selectedListItem = e.target.parentElement.parentElement;

          const selectedListItemId = selectedListItem.id;

          const idArr = selectedListItemId.split("-");

          const id = parseInt(idArr[1]);

          const selectedItem = ItemCtrl.getItemToEdit(id);

          ItemCtrl.setCurrentItem(selectedItem);

          UICtrl.showItemInForm();
          UICtrl.showEditState();
        }

        e.preventDefault();
      });

    // Updating the selected item from the list
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", function (e) {
        const input = UICtrl.getMealAndCalories();

        const updatedItem = ItemCtrl.updateItem(
          input.mealName,
          parseInt(input.calories)
        );

        UICtrl.updateListItem(updatedItem);
        StorageCtrl.updateItemInLocalStorage(updatedItem);

        const totalCalories = ItemCtrl.getCalories();
        UICtrl.displayTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
      });

    // Back button
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function (e) {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    // Delete Button
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", function (e) {
        const currentItem = ItemCtrl.getCurrentItem();

        const selectedID = currentItem.id;

        ItemCtrl.deleteSelectedItem(selectedID);

        UICtrl.deleteItemFromUI(selectedID);

        StorageCtrl.deleteItemFromLocalStorage(selectedID);

        const totalCalories = ItemCtrl.getCalories();

        UICtrl.displayTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
      });

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", function (e) {
        ItemCtrl.clearAllListItems();
        UICtrl.clearUIListItems();
        StorageCtrl.clearLocalStorage();

        e.preventDefault();
      });
  };

  return {
    init: function () {
      UICtrl.clearEditState();

      // Get items from the data structure in the ItemCtrl
      const items = ItemCtrl.getData();

      // Hide list when empty
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Call populate function in UICtrl
        UICtrl.populateItemList(items);
      }

      // Get total calories from ItemCtrl
      const totalCalories = ItemCtrl.getCalories();
      UICtrl.displayTotalCalories(totalCalories);

      // Call Load Event Listeners Function
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
