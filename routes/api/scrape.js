const router = require("express").Router();
const scrapeController = require("../../controllers/scrapeController");
const axios = require("axios");
const cheerio = require("cheerio");

function randomLinkGenerator(links, num) {
    const arr = []
    const arrIndex = []
    while (arr.length < num) {
        const r = Math.floor(Math.random() * links.length);
        if (arrIndex.indexOf(r) === -1) {
            const randLink = `wikipedia.org${links[r]}`
            arr.push(randLink);
            arrIndex.push(r);
        }
    }
    return arr;
}

router.route("/scrape", async function (req, res) {
    const url = req.body.url
    axios.get(url, {
        validateStatus: function (status) {
            return status < 500;
        }
        // headers: {
        //     'Access-Control-Allow-Origin': "*",
        //     'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        //     'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
        // }
    }).then(response => {
        console.log(response)
        const result = {};
        if (response.status === 200) {
            const linkArr = [];
            const $ = cheerio.load(response.data);
            $(".mw-body").each(function (i, element) {
                result.title = $(this).children("h1#firstHeading").text();
                result.summary = `${$(this).find("p").text().slice(0,300).replace(/ *\[[^\]]*]/, '')}...`;
                result.image = $(this).find(".image").attr("href");
                const links = $(this).find("a");
                result.url = `https://wikipedia.org/wiki/${result.title.replace(/ /g, "_")}`;
                // push all links into an array
                $(links).each(function (i, link) {
                    linkArr.push(`${$(link).attr('href')}`)
                });
                // filter the links to grab good urls
                const filteredLinks = linkArr.filter(link => link.includes(`/wiki/`) && !link.includes(`:`) &&
                    !link.includes(`%`) && !link.includes(`#`))
                // grabs specified number of unique random numbers
                if (filteredLinks.length < 20) {
                    result.randomLinks = randomLinkGenerator(filteredLinks, filteredLinks.length);
                } else {
                    result.randomLinks = randomLinkGenerator(filteredLinks, 20);
                }
                // checks for a good image and then will grab its base code
                if (result.image) {
                    result.image = `https://wikipedia.org${result.image}`;
                    axios.get(result.image).then(function (response) {
                        const $ = cheerio.load(response.data);
                        $(".fullImageLink").each(function (i, element) {
                            result.image = $(this).children("a").attr("href")
                            console.log(result)
                            res.json(result);
                        });
                    }).catch(err => console.log(err));
                } else {
                    result.image = noImage;
                    console.log(result)
                    res.json(result);
                }
            });
        } else {
            result.title = "Page not found"
            result.image = "";
            result.url = "";
            result.summary = "";
            result.randomLinks = [];
            res.json(result);
        }
    }).catch(err => console.log(err));






    // url = "https://en.wikipedia.org/wiki/Special:Random?origin=*";


});
router.route("/:theUrl/:linkCount")
    .get(scrapeController.grabScrape);


module.exports = router;