const api_url = {
	Python: "http://localhost:3000/Python",
	Exel: "http://localhost:3000/Exel",
	WebDevelopment: "http://localhost:3000/WebDevelopment",
	JavaScript: "http://localhost:3000/JavaScript",
	Aws: "http://localhost:3000/Aws",
	Drawing: "http://localhost:3000/Drawing",
	DataScience: "http://localhost:3000/DataScience",
};
const categoties = [
	"Python",
	"Exel",
	"WebDevelopment",
	"JavaScript",
	"Aws",
	"Drawing",
	"DataScience",
];
const fetch_json = async (url) => {
	let response = await fetch(url);
	let json = await response.json();
	return json;
};

function draw_json_from_title(title) {
	let url = api_url[title];

	let thejson;
	fetch_json(url)
		.then((json) => {
			localStorage.setItem(title, JSON.stringify(json));
			thejson = json;
		})
		.then(() => {
			draw_category_section(thejson, title);
		});
}

function clear_all_childs_except_first_x(x, parent) {
	while (parent.childElementCount > x) {
		parent.removeChild(parent.lastElementChild);
	}
}
function draw_category_section(category, title) {
	let tit = document.querySelector("#category-header");
	tit.textContent = category.header;
	let desc = document.querySelector("#category-description");
	desc.textContent = category.description;
	let btn = document.querySelector("#explore-course");
	btn.innerHTML = `<b>  explore ${title}  </b>`;
	let courses = category.courses;
	let parent = document.querySelector("#courses-viewer");
	clear_all_childs_except_first_x(1, parent);
	courses.forEach((element) => {
		card = create_course_card(element);
		parent.appendChild(card);
	});
}
function create_course_card(card_data) {
	let course_card = document.querySelector("#standard-course-card");
	let new_card = course_card.cloneNode(true);
	new_card.setAttribute("id", "");
	new_card.style.display = "flex";
	let img = new_card.querySelector(".course-img");
	img.setAttribute("src", card_data.image);
	let title = new_card.querySelector(".course-title > h3");
	title.textContent = card_data.title;
	let price = new_card.querySelector(".course-price > b");
	price.textContent = card_data.price;
	let author = new_card.querySelector(".course-author");
	author.textContent = get_authors(card_data.instructors);
	return new_card;
}
function get_authors(autor) {
	let ret = "";
	autor.forEach((element) => {
		ret += element.name + ", ";
	});
	return ret.substring(0, ret.length - 2);
}
function extract_txt_from_form() {
	let ret = "";
	let bar = document.querySelector(".search-bar > .search-input");
	ret = bar.value;
	return ret;
}
function disable_some_cards(str) {
	let cards = document.querySelectorAll(".course-card");
	cards.forEach((card) => {
		let title = card.querySelector(".course-title > h3");
		let tit = title.textContent;

		if (tit.includes(str)) {
			card.style.display = "flex";
		} else {
			card.style.display = "none";
		}
	});
}
function filter() {
	let str = extract_txt_from_form();
	disable_some_cards(str);
}

let btn_search = document.querySelector("#searchbt");
btn_search.addEventListener("click", () => {
	filter();
});
function draw_category(txt) {
	let item = document.createElement("li");
	let anch = document.createElement("a");
	anch.classList.add("nav-link");
	anch.classList.add("category-clickable-link");
	anch.href = "javascript:void(0)";
	anch.textContent = txt;
	item.appendChild(anch);
	return item;
}
function draw_cat_navbar_from_json(start_cate) {
	let comp = document.querySelector("#category-navbar-list");
	for (let i = 0; i < categoties.length; i++) {
		let cat = draw_category(categoties[i]);

		if (cat.textContent == start_cate) {
			let tmp = cat.querySelector("a");
			tmp.classList.add("active");
		}
		comp.appendChild(cat);
	}
}
function clear_active_all_cat() {
	let all_links = document.querySelectorAll(".category-clickable-link");
	all_links.forEach((link) => {
		link.classList.remove("active");
	});
}

draw_json_from_title("Python");
draw_cat_navbar_from_json("Python");

let cat_links = document.querySelectorAll(".category-clickable-link");
for (let i = 0; i < cat_links.length; i++) {
	cat_links[i].addEventListener("click", () => {
		clear_active_all_cat();
		let tmp = cat_links[i];
		tmp.classList.add("active");
		draw_json_from_title(cat_links[i].textContent);
	});
}
