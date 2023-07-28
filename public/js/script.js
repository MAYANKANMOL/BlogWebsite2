document.addEventListener('DOMContentLoaded',function(){
    const buttons = document.querySelector(".search_btn");
    const searchbar = document.querySelector(".searchBar");
    const searchinput = document.getElementById("searchInput");
    const searchclose = document.getElementById("searchClose");
    buttons.addEventListener("click", function(){
        searchbar.classList.add("open");
        this.setAttribute("aria-expanded", "true");
        searchinput.focus();
    });
    searchclose.addEventListener("click", function(){
        searchbar.classList.remove("open");
        this.setAttribute("aria-expanded", "false");
    });
});
