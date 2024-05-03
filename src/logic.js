function show_all(e) {
	// Strip *ALL* styling to unhide all, dont use inline styles...
	document.querySelectorAll('body [style]').forEach(i => {
		i.removeAttribute('style');
	});

	// Scroll to top, we want this... right?
	document.querySelector('.content').scrollTo({
		top: 0,
		behavior: 'smooth'
	});

	// If we have an anchor in the URL, remove it
	const uri = window.location.toString();
    if (uri.indexOf('#') > 0) {
    	window.history.pushState('', '/', window.location.pathname);
    }
}

function toggle_sidenav() {
	const sidebar = document.querySelector('.list');
	const style = window.getComputedStyle(sidebar);

	if (style.getPropertyValue('display') != 'none')
	{
		sidebar.style.display = 'none';
	} else {
		sidebar.style.display = 'block';
	}
}

function build_next_page_links() {
	document.querySelectorAll('ul.list > li').forEach(item => {
		let menu_item = item.querySelector('a');
		if (menu_item !== null)
		{
			menu_item = menu_item.getAttribute('href');

			// Find the next section from the nav and add it to the page end buttons
			// Find our current DOM element ID and start from there + 1
			const index = Array.prototype.indexOf.call(item.parentNode.children, item);
			const nav_item = document.querySelector('ul.list');
			for (let i = index + 1; i < nav_item.childElementCount; ++i) {

				const has_href = nav_item.children[i].querySelector('a');

				if (has_href !== null)
				{
					const a = document.querySelector(`${menu_item} h1.nextpage a`)
					if (a !== null)
					{
						a.href = has_href.getAttribute('href');
					}
					break;
				}
			}
		}
	});
}

function partition(e) {
	// We cant find anchor, dont process anything so we dont hide all content
	if(!e || !validate_query(e)) {
		return;
	}

	// Unhide all 'next page' buttons
	document.querySelectorAll('h1.nextpage').forEach(i => {
		i.style.display = 'block';
	});

	// Hide first HR of section, we dont need to see it
	document.querySelectorAll('div.content div > hr').forEach(i => {
		i.style.display = 'none';
	});
	
	let sub_anchor = true;

	// Process navbar styling
	document.querySelectorAll('ul.list > li').forEach(item => {
		item.removeAttribute('style');

		const nav_link = item.querySelectorAll('[href]');
		for (let i = 0; i < nav_link.length; ++i) {

			// If match, style it
			if (nav_link[i].getAttribute('href') == e)
			{
				sub_anchor = false;
				item.style.backgroundColor = '#26231f';
				nav_link[i].style.fontWeight = '800';
				continue;
			}

			nav_link[i].removeAttribute('style');
		}
	});

	// We can get linked to sub anchors but the section we are in wont be highlighted in the sidebar, make sure it is
	if (sub_anchor)
	{
		// Make sure new pages added have the "main" tag so we can step up the DOM to find its ID
		let id = document.querySelector(e).closest('[main]').id;
		if (id !== null)
		{
			id = document.querySelector(`ul.list li a[href="#${id}"]`);
			if (id !== null)
			{
				id.parentElement.style.backgroundColor = '#26231f';
			}
		}
	}

	// Hide all other sections
	const divs = document.querySelectorAll('div.content > div');
	for (let i = 0; i < divs.length; ++i) {

		// If we dont have an ID hide it (separators)
		if (!divs[i].id)
		{
			divs[i].style.display = 'none';
			continue;
		}

		// See if we link to a 'main' section (one of the html files we include), remove styling if so
		if ('#' + divs[i].id == e)
		{
			divs[i].removeAttribute('style');
			continue;
		}

		// If we are not pointing to a main section, process the ID and go to section
		if (!divs[i].querySelector(e))
		{
			divs[i].style.display = 'none';
		} else {
			divs[i].removeAttribute('style');
		}
	}

	const scroller = document.querySelector(`div.content ${e}`);
	if (scroller !== null) {
		scroller.scrollIntoView();
	}

	// Close nav on smaller devices on nav selection
	const toggler = document.querySelector('#toggle');
	const toggler_style = window.getComputedStyle(toggler);

	const nav = document.querySelector('ul.list');
	const nav_style = window.getComputedStyle(nav);

	if (toggler_style.getPropertyValue('display') !== 'none' && nav_style.getPropertyValue('display') !== 'none')
	{
		toggle_sidenav();
	}
}

function validate_query(str) {
    try {
    	if (!document.querySelector(str))
		{
			console.log(`Cant find anchor: ${str}`);
			return false;
		}

        return true;
    }
    catch(e) {
    	console.error(e);
    }
    return false;
}

document.querySelector('header').addEventListener('click', show_all);
document.querySelector('.all').addEventListener('click', show_all);
document.querySelector('#toggle').addEventListener('click', toggle_sidenav);

window.matchMedia("(max-width: 900px)").addEventListener("change", () => {
	// Remove style on resize so we dont get hidden sidebar since we are setting styling via JS
	document.querySelector('.list').removeAttribute('style');
});

window.addEventListener('DOMContentLoaded', () => {
	build_next_page_links();
	partition(window.location.hash);
}, true);

// Jump to anchor when using back/forward
window.addEventListener('hashchange', () => {
	partition(window.location.hash);
}, true);