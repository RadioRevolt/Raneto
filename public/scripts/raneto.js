
;(function ($, hljs) {

  "use strict";

  var current_category;

  $(document).ready(function () {

    // Enable Highlighting and other
    // things when there is content
    if ($(".content").length) {

      // Syntax highlighting
      hljs.initHighlightingOnLoad();

      // Add Bootstrap styling to tables
      $(".content table").addClass("table");

      // FitVids
      fitvids(".content");
    }

    // Deal with Home Categories
    if ($(".home-categories").length) {
      $(".home-categories").masonry({
        columnWidth        : ".col",
        itemSelector       : ".col",
        transitionDuration : 0
      });
    }

    // Edit Page
    $(".goto-edit").click(function () {
      window.location.href = window.location.href + "/edit";
    });

    // Modal: Add Page Confirm
    $("#add-page-confirm").click(function () {
      $("#addModal").modal("hide");
      var name = $("#page-name").val().replace(/\s+/g, "-");
      $.post("/rn-add-page", {
        name     : name,
        category : current_category
      }, function (data) {
        switch (data.status) {
          case 0:
            window.location = [current_category, name, "edit"].join("/");
            break;
        }
      });
    });

    // Modal: Delete Page Confirm
    $("#delete-page-confirm").click(function () {
      $("#deleteModal").modal("hide");
      $.post("/rn-delete", {
        file : decodeURI(window.location.pathname)
      }, function (data) {
        switch (data.status) {
          case 0:
            window.location = "/";
            break;
        }
      });
    });

    // Add Page
    $(".add-page").click(function () {
      var text = $(this).closest("h5")
                    .clone()
                    .children()
                    .remove()
                    .end()
                    .text()
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");
      current_category = text != "main-articles" ? text : "";
    });

    // New Category
    $("#newCategory").keypress(function (e) {
      if (e.which === 13) {
        $.post("/rn-add-category", {
          category : $(this).val()
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-")
        }, function (data) {
          location.reload();
        });
      }
    });

    // Close Edit
    $(".close-edit").click(function () {
      // Remove the trailing "/edit"
      var the_arr = window.location.href.split("/");
      the_arr.pop();
      window.location = the_arr.join("/");
    });

    // Save Page
    $(".save-page").click(function () {
      var file_arr = window.location.pathname.split("/");
      file_arr.pop();
      $("#entry-markdown").next(".CodeMirror")[0].CodeMirror.save();
      $.post("/rn-edit", {
        file    : decodeURI(file_arr.join("/")),
        content : $("#entry-markdown").val()
      }, function (data) {
        switch (data.status) {
          case 0:
            $("#edit-status").slideUp(function () {
              $("#edit-status").text("Page Successfully Saved");
              $("#edit-status").removeClass();
              $("#edit-status").addClass("alert alert-success");
              $("#edit-status").slideDown();
            });
            break;
          case 1:
            $("#edit-status").slideUp(function () {
              $("#edit-status").text("Error Saving Page");
              $("#edit-status").removeClass();
              $("#edit-status").addClass("alert alert-warning");
              $("#edit-status").slideDown();
            });
            break;
        }
      });
    });

  });

})(jQuery, hljs);
