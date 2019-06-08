let converter = new showdown.Converter()

converter.setOption("strikethrough", true)

function readDocumentFromUrl(url, callback) {
  var xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText)
    } else {

		}
  }

  xhttp.open("GET", url, true)
  xhttp.send()
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

let itemData
let container = document.getElementById("container")
let locale
let itemTypes = [
	"Artifact",
	"Active",
	"Coin",
	"Bomb",
	"Key",
	"Heart",
	"Lamp",
	"Weapon"
]

function setPageContent(array) {
	container.innerHTML = converter.makeHtml(array.join(""))
}

function translate(key) {
	var v = locale[key]

	if (v) {
		return v
	}

	return "???"
}

readDocumentFromUrl("https://raw.githubusercontent.com/egordorichev/BurningWiki/master/data/en.json", function(text) {
	locale = JSON.parse(text)

	readDocumentFromUrl("https://raw.githubusercontent.com/egordorichev/BurningWiki/master/data/items/items.json", function(text) {
		itemData = JSON.parse(text)

		let item = getUrlParameter("item")

		if (item) {
			var data = itemData[item]

			if (!data) {
				setPageContent([ `Unknown item ${item}` ])
				return
			}

			let page = [ "<table>"]
			console.log(data)

			page.push(`<tr><th>Name</th><th>${translate(item)}</th></tr>`)
			page.push(`<tr><th>Description</th><th>${translate(item + "_desc")}</th></tr>`)
			page.push(`<tr><th>Type</th><th>${itemTypes[data.type]}</th></tr>`)
			page.push(`<tr><th>Use time</th><th>${data.time}</th></tr>`)
			page.push(`<tr><th>ID</th><th>${item}</th></tr>`)

			page.push("</table>")

			page.push("###### Can be found in<br/>")

			if (data.uses) {
				page.push("###### Uses<br/>")

				for (var use in data.uses) {
					page.push(`* ${use.id}`)
				}
			}

			if (data.renderer) {
				page.push("###### Renderer<br/>")
				page.push(`${data.renderer.id}`)
			}

			setPageContent(page)
			return
		}

		let page = [ "<table><tr><th>ID</th><th>Name</th><th>Type</th><th>Description</th></tr>"]
		let sortType = getUrlParameter("type")

		for (var key in itemData) {
			var data = itemData[key]

			if (sortType && sortType != data.type) {
				continue
			}

			page.push("<tr>")

			page.push(`<th><a href="?item=${key}">${key}</a></th>`)
			page.push(`<th>${translate(key)}</th>`)
			page.push(`<th><a href="?type=${data.type}">${itemTypes[data.type]}</a></th>`)
			page.push(`<th>${translate(key + "_desc")}</th>`)

			page.push("</tr>")
		}

		page.push("</table>")
		setPageContent(page)
	})
})

/*
readDocumentFromUrl("https://raw.githubusercontent.com/egordorichev/BurningWiki/master/data/items/bk%3tAsword.md", function(text) {
	document.getElementById("container").innerHTML = converter.makeHtml(text)
})*/
