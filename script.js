/*fetch(url)
		.then((response) => response.json())
		.then((json) => console.log(json));
        fetch_json("http://localhost:3000/Python").then((value) => {
	console.log(value);
});
        
        
        */
const api_url = {
	python: "http://localhost:3000/Python",
};
const fetch_json = async (url) => {
	let response = await fetch(url);
	let json = await response.json();

	return json;
};

function draw_json_from_title(title) {
	let url = api_url[title];
	/*let json = JSON.parse(localStorage.getItem(title));
	if (json) {
		draw_category_section(json, title);
	} else {*/
	let thejson;
	fetch_json(url)
		.then((json) => {
			localStorage.setItem(title, JSON.stringify(json));
			thejson = json;
		})
		.then(() => {
			draw_category_section(thejson, title);
		});
	//}
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
function is_substr(big_str, str) {
	console.log(big_str);
	if (big_str.length == 0) return false;
	if (str.length == 0) return true;
	for (let i = 0; i < big_str.length; i++) {
		for (let j = 0, k = i; j < str.length && k < big_str.length; j++, k++) {
			if (big_str[k] != str[j]) break;
			if (j == str.length - 1) return true;
		}
	}
	return false;
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

		if (is_substr(tit, str)) {
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
draw_json_from_title("python");

let btn_search = document.querySelector("#searchbt");
btn_search.addEventListener("click", () => {
	filter();
});
