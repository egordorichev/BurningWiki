let converter = new showdown.Converter()

converter.setOption("strikethrough", true)

function readDocumentFromUrl(url, callback) {
  var xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText)
    } else {
		callback(null)
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
	"ConsumableArtifact",
	"Weapon",
	"Battery",
	"Hat",
	"Pouch",
	"Scourge"
]

function setPageContent(array) {
	container.innerHTML = converter.makeHtml(array.join(""))
}

function translate(key) {
	if (!locale) {
		return "404"
	}
	
	var v = locale[key]

	if (v) {
		return v
	}

	return "???"
}

readDocumentFromUrl("https://raw.githubusercontent.com/egordorichev/BurningWiki/master/data/en.json", function(text) {
	locale = JSON.parse(text)

	readDocumentFromUrl("https://raw.githubusercontent.com/egordorichev/BurningWiki/master/data/items/items.json", function(text) {
		if (text == null) {
			setPageContent([ "Failed to load item data" ])
			return
		}

		itemData = JSON.parse(text)
		let item = getUrlParameter("item")

		if (item) {
			readDocumentFromUrl(`https://raw.githubusercontent.com/egordorichev/BurningWiki/master/data/items/${item}.md`, function(text) {
							

				var data = itemData[item]

				if (!data) {
					setPageContent([ `Unknown item ${item}` ])
					return
				}

				let page = [ `<h1>${translate(item)}</h1><table>`]

				page.push(`<tr><th>Name</th><th>${translate(item)}</th></tr>`)
				page.push(`<tr><th>Description</th><th>${translate(item + "_desc")}</th></tr>`)
				page.push(`<tr><th>Type</th><th>${itemTypes[data.type]}</th></tr>`)
				page.push(`<tr><th>Use time</th><th>${data.time}</th></tr>`)
				page.push(`<tr><th>ID</th><th>${item}</th></tr>`)

				page.push("</table>")

				if (text != null) {
					page.push(text)
				}

				if (data.pools) {
					page.push("<h4>Can be found in</h4>")

					for (var pool in data.pools) {
						page.push(`* ${pool}`)
					}
				}

				if (data.uses && data.uses.length > 0) {
					page.push("<h4>Uses</h4><ul>")

					for (var i = 0; i < data.uses.length; i++) {
						var use = data.uses[i]
						page.push(`<li>${use.id}</li>`)
					}

					page.push("</ul>")
				}

				if (data.renderer) {
					page.push("<h4>Renderer</h4>")
					page.push(`${data.renderer.id}`)
				}

				setPageContent(page)
			})

			return
		}

		let page = [ "<table><tr><th>ID</th><th>Name</th><th>Type</th><th>Description</th></tr>"]
		let sortType = getUrlParameter("type")

		for (var key in itemData) {
			var data = itemData[key]

			if (sortType && sortType != data.type) {
				continue
			}
			
			var type = data.type
			
			if (type == undefined) {
				type = 0	
			}

			page.push("<tr>")

			page.push(`<th><a href="?item=${key}">${key}</a></th>`)
			page.push(`<th>${translate(key)}</th>`)
			page.push(`<th><a href="?type=${type}">${itemTypes[type]}</a></th>`)
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
