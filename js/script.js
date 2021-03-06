$(function () {
  // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://oberonprime117.github.io/json/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://oberonprime117.github.io/json/menu_items/";
  var menupierceUrl = "https://oberonprime117.github.io/json/piercing.json";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  var pierceTitleHtml = "snippets/piercings-title-snippet.html"
  var pierceItemHtml = "snippets/pierce-menu.html";

  var categoryName;
  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/value.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };
  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    // Remove 'active' from home button
    // Add 'active' to menu button if not already there
    /*classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }*/
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML, // ***** <---- TODO: STEP 1: Substitute [...] ******
      true
    ); // Explicitely setting the flag to get JSON from server processed into an object literal
  });
  
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-kontent");
    $ajaxUtils.sendGetRequest(
      menupierceUrl,
      buildAndShowPierceHTML,
      true // ***** <---- TODO: STEP 1: Substitute [...] ******
    ); // Explicitely setting the flag to get JSON from server processed into an object literal
  });
  
  // *** finish **

  // Builds HTML for the home page based on categories array
  // returned from the server.
  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Load home snippet page
        $ajaxUtils.sendGetRequest(
          homeHtmlUrl,
          function (homeHtmlUrl) {
            var finalHtml = categoriesTitleHtml;
            finalHtml += "<section class='row'>";

            // Loop over categories
            for (var i = 0; i < categories.length; i++) {
              // Insert category values
              var html = homeHtmlUrl;
              var name = "" + categories[i].name;
              var short_name = categories[i].short_name;
              html = insertProperty(html, "name", name);
              html = insertProperty(html, "short_name", short_name);
              finalHtml += html;
            }

            finalHtml += "</section>";
            insertHtml("#main-content", finalHtml);
            
          },
          false
        );
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  function buildAndShowPierceHTML(categories) {
    $ajaxUtils.sendGetRequest(
      pierceTitleHtml,
      function (pierceTitleHtml) {
        // Load home snippet page
        $ajaxUtils.sendGetRequest(
          pierceItemHtml,
          function (pierceItemHtml) {
            var finalHtml = pierceTitleHtml;
            finalHtml += "<section class='row'>";
            
            // Loop over categories
            for (var i = 0; i < categories.length; i++) {
              // Insert category values
              var html = pierceItemHtml;
              var name = "" + categories[i].name;
              var short_name = categories[i].short_name;
              html = insertProperty(html, "name", name);
              html = insertProperty(html, "short_name", short_name);
              finalHtml += html;
            }

            finalHtml += "</section>";
            insertHtml("#main-kontent", finalHtml);
            
          },
          false
        );
      },
      false
    ); // False here because we are getting just regular HTML from the server, so no need to process JSON.
  }

  

  // Load the menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowHomeHTML);
  };

  // THIS IS THE LINE YOU EDITED
  // Load the menu items view
  // 'categoryShort' is a short_name for a category
 dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    categoryName = categoryShort;
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML
    );
  };
  
  /*
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-kontent");
    categoryName = categoryShort;
    $ajaxUtils.sendGetRequest(
      menupierceUrl + categoryShort + ".json",
      buildAndShowPierceItemsHTML
    );
  };
  document.addEventListener("DOMContentLoaded", dc.loadMenuItems = function (event,categoryShort) {
    showLoading("#main-kontent");
    categoryName = categoryShort;
    $ajaxUtils.sendGetRequest(
      menupierceUrl + categoryShort + ".json",
      buildAndShowPierceItemsHTML, // ***** <---- TODO: STEP 1: Substitute [...] ******
      
    ); // Explicitely setting the flag to get JSON from server processed into an object literal
  });*/

  

  // Builds HTML for the categories page based on the data
  // from the server
  function buildAndShowCategoriesHTML(categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();

            var categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);
          },
          false
        );
      },
      false
    );
  }

  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category page based on the data
  // from the server
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    // Load title snippet of menu items page
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // Retrieve single menu item snippet
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();

            var menuItemsViewHtml = buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            );
            insertHtml("#main-content", menuItemsViewHtml);
          },
          false
        );
      },
      false
    );
  }

  /*function buildAndShowPierceItemsHTML(categoryMenuItems) {
    // Load title snippet of menu items page
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // Retrieve single menu item snippet
        $ajaxUtils.sendGetRequest(
          pierceItemHtml,
          function (pierceItemHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();

            var pierceItemsViewHtml = buildPierceItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              pierceItemHtml
            );
            insertHtml("#main-kontent", pierceItemsViewHtml);
          },
          false
        );
      },
      false
    );
  }*/

  // Using category and menu items data and snippets html
  // build menu items view HTML to be inserted into page
  function buildMenuItemsViewHtml(
    categoryMenuItems,
    menuItemsTitleHtml,
    menuItemHtml
  ) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category_name
    );
    /* menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);
*/
    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over menu items
    var menuItems = categoryMenuItems.menu_items;
    //var catShortName = categoryMenuItems.category_name;
    for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values

      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "category_name", categoryName);
      html = insertProperty(html, "name", menuItems[i].name);
      
      
      // Add clearfix after every second menu item

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // PIERCE STARTS
  /*function buildPierceItemsViewHtml(
    categoryMenuItems,
    menuItemsTitleHtml,
    pierceItemHtml
  ) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category_name
    );
    
    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

   
     var menuItems = categoryMenuItems.menu_items;
    
    for (var i = 0; i < 28; i++) {
      

      var html = pierceItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "category_name", categoryName);

      // Add clearfix after every second menu item

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }*/
  // PIERCE ENDS

  // Appends price with '$' if price exists
  function insertItemPrice(html, pricePropName, priceValue) {
    // If not specified, replace with empty string
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  // Appends portion name in parens if it exists
  function insertItemPortionName(html, portionPropName, portionValue) {
    // If not specified, return original string
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  global.$dc = dc;
})(window);
