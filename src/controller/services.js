const axios = require("axios")
const services = require("../helper/sevice")
const cheerio = require("cheerio")
const baseUrl = require("../constant/url")
const episodeHelper = require("../helper/episodeHelper")

const Services = {
    getOngoing: async (req, res) => {
        const page = req.params.page
        let url = page === 1 ? `${baseUrl}/ongoing-anime/` : `${baseUrl}/ongoing-anime/page/${page}/`
        try {
            const response = await services.fetchService(url, res)
            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                const element = $(".rapi")
                let ongoing = []
                let title, thumb, total_episode, updated_on, updated_day, endpoint
    
                element.find("ul > li").each((index, el) => {
                    title = $(el).find("h2").text().trim()
                    thumb = $(el).find("img").attr("src")
                    total_episode = $(el).find(".epz").text()
                    updated_on = $(el).find(".newnime").text()
                    updated_day = $(el).find(".epztipe").text()
                    endpoint = $(el).find(".thumb > a").attr("href").replace(`${baseUrl}/anime/`, "").replace("/", "")
    
                    ongoing.push({
                        title,
                        thumb,
                        total_episode,
                        updated_on,
                        updated_day,
                        endpoint,
                    })
                })
                return res.status(200).json({
                    owner: "Bhuzel",
                    status: true,
                    message: "success",
                    ongoing,
                    currentPage: page
                })
            }
            return res.send({
                message: response.status,
                ongoing: [],
            });
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                message: error,
                ongoing: [],
            });
        }
    },
    getCompleted: async (req, res) => {
        const page = req.params.page
        let url = page === 1 ? `${baseUrl}/complete-anime/` : `${baseUrl}/complete-anime/page/${page}/`
    
        try {
            const response = await services.fetchService(url, res)
            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                const element = $(".rapi")
                let completed = []
                let title, thumb, total_episode, updated_on, score, endpoint
    
                element.find("ul > li").each((index, el) => {
                    title = $(el).find("h2").text().trim()
                    thumb = $(el).find("img").attr("src")
                    total_episode = $(el).find(".epz").text()
                    updated_on = $(el).find(".newnime").text()
                    score = $(el).find(".epztipe").text().trim()
                    endpoint = $(el).find(".thumb > a").attr("href").replace(`${baseUrl}/anime/`, "").replace("/", "")
    
                    completed.push({
                        title,
                        thumb,
                        total_episode,
                        updated_on,
                        score,
                        endpoint,
                    })
                })
    
                return res.status(200).json({
                    owner: "Bhuzel",
                    status: true,
                    message: "success",
                    completed,
                    currentPage: page
                })
            }
            return res.send({
                status: response.status,
                completed: []
            })
        } catch (error) {
            console.log(error)
            res.send({
                status: false,
                message: error,
                completed: [],
            });
        }
    },
    getSearch: async (req, res) => {
        const query = req.params.q
        let url = `${baseUrl}/?s=${query}&post_type=anime`
        try {
            const response = await services.fetchService(url, res)
            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                const element = $(".page")
                let search = []
                let title, thumb, genres, status, rating, endpoint
    
                element.find("li").each((index, el) => {
                    title = $(el).find("h2 > a").text()
                    thumb = $(el).find("img").attr("src")
                    genres = $(el).find(".set > a").text().match(/[A-Z][a-z]+/g)
                    status = $(el).find(".set").text().match("Ongoing") || $(el).find(".set").text().match("Completed")
                    rating = $(el).find(".set").text().replace(/^\D+/g, '') || null
                    endpoint = $(el).find("h2 > a").attr("href").replace(`${baseUrl}/anime/`, "").replace("/", "")
    
                    search.push({
                        title,
                        thumb,
                        genres,
                        status,
                        rating,
                        endpoint,
                    })
                })
                return res.status(200).json({
                    owner: "Bhuzel",
                    status: true,
                    message: "success",
                    search,
                    query
                })
            }
            return res.send({
                message: response.status,
                search: [],
            });
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                message: error,
                search: [],
            });
        }
    },
    getAnimeList: async (req, res) => {
        let url = `${baseUrl}/anime-list/`
        try {
            const response = await services.fetchService(url, res)
            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                const element = $("#abtext")
                let anime_list = []
                let title, endpoint
        
                element.find(".jdlbar").each((index, el) => {
                    title = $(el).find("a").text() || null
                    endpoint = $(el).find("a").attr("href").replace(baseUrl, "");
        
                    if (title) {
                        anime_list.push({
                            title,
                            endpoint // Menyimpan hanya path (endpoint)
                        })
                    }
                })
        
                // Mengelompokkan anime berdasarkan huruf pertama judul
                let groupedAnimes = anime_list.reduce((groups, anime) => {
                    const firstLetter = anime.title.charAt(0).toUpperCase(); // Ambil huruf pertama dan ubah jadi kapital
                    if (!groups[firstLetter]) {
                        groups[firstLetter] = []; // Jika belum ada kategori, buat array baru
                    }
                    groups[firstLetter].push({
                        title: anime.title,
                        url: anime.endpoint // Menggunakan hanya path (endpoint)
                    }); // Masukkan anime ke dalam kategori yang sesuai
                    return groups;
                }, {});
        
                // Mengembalikan hasil pengelompokkan
                return res.status(200).json({
                    owner: "Bhuzel",
                    status: true,
                    message: "success",
                    anime_list: groupedAnimes
                })
            }
            return res.send({
                message: response.status,
                anime_list: [],
            });
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                message: error,
                anime_list: [],
            });
        }
    },
    
    
    getAnimeDetail: async (req, res) => {
        const endpoint = req.params.endpoint;
        let url = `${baseUrl}/anime/${endpoint}/`;
    
        try {
            // Mengambil data anime langsung dari URL
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Referer": "https://otakudesu.cloud/"
                }
            });
    
            const $ = cheerio.load(data);
            const result = {};
    
            // Menyusun detail anime
            result.title = $(".jdlrx h1").text().trim();
            result.image = $(".fotoanime img").attr("src") || null;
            result.synopsis = $(".sinopc").text().trim();
            result.metadata = {};
            $(".infozingle p").each((_, el) => {
                const rawLabel = $(el).find("b").text().trim().replace(":", "");
                const label = rawLabel.toLowerCase().replace(/\s+/g, '');
                const value = $(el).text().split(":").slice(1).join(":").trim();
                if (label && value) {
                    result.metadata[label] = value;
                }
            });
    
            // Genre list (array)
            result.metadata.genres = [];
            $(".infozingle a").each((_, el) => {
                result.metadata.genres.push($(el).text().trim());
            });
    
            // Episode list, batch, dan lengkap dipisah
            result.episodes = [];
            result.batch = null;
            result.complete = null;
    
            // Mengambil episode
            $(".episodelist ul li a").each((_, el) => {
                const title = $(el).text().trim();
                let url = $(el).attr("href");
    
                // Ambil sisa path setelah domain
                url = url.replace("https://otakudesu.cloud", "");
    
                if (/batch/i.test(title)) {
                    result.batch = { title, url };
                } else if (/lengkap/i.test(title) || /\/lengkap\//i.test(url)) {
                    result.complete = { title, url };
                } else {
                    result.episodes.push({ title, url });
                }
            });
    
            return res.status(200).json({
                owner: "Bhuzel",
                status: true,
                message: "success",
                anime_detail: result,
                endpoint
            });
    
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: false,
                message: error.message,
                anime_detail: [],
                episode_list: []
            });
        }
    },    
    
    getEmbedByContent: async(req, res) => {
        try {
            let nonce = await episodeHelper.getNonce();
            let content = req.params.content 

            const html_streaming = await episodeHelper.getUrlAjax(content, nonce)
            const parse = cheerio.load(html_streaming)
            const link = parse('iframe').attr('src')
            const obj = {};
            obj.stream_url = link

            res.send(obj);
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    },
    getAnimeEpisode: async (req, res) => {
        const endpoint = req.params.endpoint;
        const url = `${baseUrl}/episode/${endpoint}`;
      
        try {
          const response = await services.fetchService(url, res);
          const $ = cheerio.load(response.data);
          const streamElement = $("#lightsVideo").find("#embed_holder");
    
          const result = {};
          result.title = $(".venutama > h1").text();
          
          // Menambahkan image dari div.cukder
          result.image = $(".cukder img").attr("src");
    
          result.stream_url = streamElement.find(".responsive-embed-stream > iframe").attr("src");
    
          // Parsing mirror per kualitas
          const qualities = ['360p', '480p', '720p'];
          const mirrors = {};
    
          qualities.forEach((q) => {
            const selector = `.mirrorstream > .m${q} > li`;
            const list = [];
    
            $(selector).each((i, el) => {
              const name = $(el).text().trim();
              const content = $(el).find('a').data('content');
              if (content) {
                list.push({
                  name,
                  content,
                  link: `/mirrors/${content}`
                });
              }
            });
    
            if (list.length) mirrors[q] = list;
          });
    
          result.mirrors = mirrors;
    
          // Navigation
          const navLinks = $(".flir > a");
          const prev = $(navLinks[0]).attr("href")?.replace(baseUrl, "") || null;
          const allEpisode = $(navLinks[1]).attr("href")?.replace(baseUrl, "") || null;
          const next = $(navLinks[2]).attr("href")?.replace(baseUrl, "") || null;
    
          result.navigation = {
            prev,
            allEpisode,
            next
          };
    
          // Tambahan episode list
          result.episodes = [];
          $(".judul-recommend-anime-series a").each((_, el) => {
            const ep = $(el).text().trim();
            const val = $(el).attr("href");
            const episodeUrl = val.split("/episode/").pop(); // Ambil bagian belakang URL
            result.episodes.push({ episode: ep, url: `/episode/${episodeUrl}` });
          });
    
          // Tambahan metadata
          result.metadata = {};
          $(".infozingle p").each((_, el) => {
            const label = $(el).find("b").text().toLowerCase().trim().replace(":", "");
            const value = $(el).text().split(":").slice(1).join(":").trim();
            if (label && value) result.metadata[label] = value;
          });
    
          result.metadata.genres = [];
          $(".infozingle a").each((_, el) => {
            result.metadata.genres.push($(el).text().trim());
          });
    
          // Tambahan download links
          result.downloads = [];
          $(".download ul li").each((_, li) => {
            const quality = $(li).find("strong").text().trim();
            const size = $(li).find("i").text().trim();
            const links = [];
    
            $(li).find("a").each((_, a) => {
              links.push({
                name: $(a).text().trim(),
                url: $(a).attr("href")
              });
            });
    
            if (quality && links.length) {
              result.downloads.push({ quality, size, links });
            }
          });
    
          res.send(result);
        } catch (err) {
          console.error(err);
          res.status(500).send({ error: "Something went wrong" });
        }
    },
    
    
    getBatchLink: async (req, res) => {
        const endpoint = req.params.endpoint;
        const fullUrl = `${baseUrl}/batch/${endpoint}`;
        console.log(fullUrl);
        try {
            const response = await services.fetchService(fullUrl, res)
            const $ = cheerio.load(response.data);
            const batch = {};
            batch.title = $(".batchlink > h4").text();
            batch.status = "success";
            batch.baseUrl = fullUrl;
            let low_quality = episodeHelper.batchQualityFunction(0, response.data);
            let medium_quality = episodeHelper.batchQualityFunction(1, response.data);
            let high_quality = episodeHelper.batchQualityFunction(2, response.data);
            batch.download_list = { low_quality, medium_quality, high_quality };
            res.send({
                owner: "Bhuzel",
                status: true,
                message: "succes",
                batch
            });
        } catch (error) {
            console.log(error)
        }
    },
    getGenreList: async (req, res) => {
        const url = `${baseUrl}/genre-list/`
        try {
            const response = await services.fetchService(url, res)
            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                let genres = [], genre, endpoint
                $('.genres').find("a").each((index, el) => {
                    genre = $(el).text()
                    endpoint = $(el).attr('href').replace("/genres/", "").replace("/", "")
        
                    genres.push({
                        genre,
                        endpoint
                    })
                })
                return res.status(200).json({
                    owner: "Bhuzel",
                    status: true,
                    message: 'success',
                    genres
                })
            }
            res.send({
                message: response.status,
                genres: []
            })
        } catch (error) {
            console.log(error);
            res.send({
                owner: "Bhuzel",
                status: false,
                message: error,
                genres: []
            });
        }
    },
    getGenrePage: async (req, res) => {
        const genre = req.params.genre
        const page = req.params.page
        const url = page === 1 ? `${baseUrl}/genres/${genre}` : `${baseUrl}/genres/${genre}/page/${page}`
        
        try {
            const response = await services.fetchService(url, res)
    
            if (response.status === 200) {
                const $ = cheerio.load(response.data)
                let genreAnime = [], title, link, studio, episode, rating, thumb, season, sinopsis, genre
                $('.col-anime-con').each((index, el) => {
                    title = $(el).find(".col-anime-title > a").text()
                    link = $(el).find(".col-anime-title > a").attr("href").replace(`${baseUrl}/anime/`, "")
                    studio = $(el).find(".col-anime-studio").text()
                    episode = $(el).find(".col-anime-eps").text()
                    rating = $(el).find(".col-anime-rating").text() || null
                    thumb = $(el).find(".col-anime-cover > img").attr("src")
                    season = $(el).find(".col-anime-date").text()
                    sinopsis = $(el).find(".col-synopsis").text()
                    genre = $(el).find(".col-anime-genre").text().trim().split(",")
    
                    genreAnime.push({
                        title,
                        link,
                        studio,
                        episode,
                        rating,
                        thumb,
                        genre,
                        sinopsis
                    })
                })
                return res.status(200).json({
                    owner: "Bhuzel",
                    status: true,
                    message: "success",
                    genreAnime
                })
            }
            return res.send({
                message: response.status,
                genreAnime: []
            })
        } catch (error) {
            console.log(error)
            res.send({
                status: false,
                message: error,
                genreAnime: []
            })
        }
    }
}

module.exports = Services
