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
let current_category = "Python";
const fetch_json = async (url) => {
	let response = await fetch(url);
	let json = await response.json();
	return json;
};

function draw_json_from_title(title) {
	let url = api_url[title];
	current_category = title;
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

function clear_all_childs(parent) {
	parent.innerHTML = "";
}
function draw_crusol_item() {
	let cr_item = document.createElement("div");
	cr_item.classList.add("carousel-item");
	let rw = document.createElement("div");
	rw.classList.add("row");
	cr_item.appendChild(rw);
	return cr_item;
	//cr_item.classList.add("justify-content-center");
}
function draw_cursel_elements(courses, course_viewer) {
	let courses_cnt = courses.length;
	let width = window.innerWidth;
	let card_width = 300;
	let tot_cards_per_item = Math.floor(width / card_width);
	let items_cnt = Math.ceil(courses_cnt / tot_cards_per_item);
	let j = 0;
	for (let i = 0; i < items_cnt; i++) {
		let cr_item = 0;
		cr_item = draw_crusol_item();
		if (i == 0) cr_item.classList.add("active");
		let k = tot_cards_per_item;
		while (k-- && j < courses_cnt) {
			let element = courses[j];
			let card = create_course_card(element);

			j++;
			cr_item.querySelector(".row").appendChild(card);
		}
		course_viewer.appendChild(cr_item);
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
	let parent = document.querySelector(".carousel-inner");
	clear_all_childs(parent);
	draw_cursel_elements(courses, parent);
}
function create_course_card(card_data) {
	let course_card = document.querySelector("#standard-course-card");
	let new_card = course_card.cloneNode(true);
	new_card.style.display = "flex";
	let img = new_card.querySelector(".course-img");
	img.setAttribute("src", card_data.image);
	let title = new_card.querySelector(".course-title > h4");
	title.textContent = card_data.title;
	let price = new_card.querySelector(".course-price > b");
	price.textContent = card_data.price;
	let author = new_card.querySelector(".course-author");
	author.textContent = get_authors(card_data.instructors);
	new_card.classList.add("col");
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
	anch.role = "button";
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

draw_json_from_title(current_category);
draw_cat_navbar_from_json(current_category);

let cat_links = document.querySelectorAll(".category-clickable-link");
for (let i = 0; i < cat_links.length; i++) {
	cat_links[i].addEventListener("click", () => {
		clear_active_all_cat();
		let tmp = cat_links[i];
		tmp.classList.add("active");
		draw_json_from_title(cat_links[i].textContent);
	});
}

window.addEventListener("resize", (event) => {
	draw_json_from_title(current_category);
});
